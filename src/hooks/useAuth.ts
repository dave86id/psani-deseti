import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  avatarBase64: string | null;
  googleEmail: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfile({
              uid: firebaseUser.uid,
              displayName: data.displayName,
              avatarBase64: data.avatarBase64 ?? null,
              googleEmail: data.googleEmail,
            });
            setNeedsProfile(false);
          } else {
            setNeedsProfile(true);
          }
        } catch {
          // offline — try localStorage
          const cached = localStorage.getItem(`profile-${firebaseUser.uid}`);
          if (cached) {
            setProfile(JSON.parse(cached));
            setNeedsProfile(false);
          } else {
            setNeedsProfile(true);
          }
        }
      } else {
        setProfile(null);
        setNeedsProfile(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const saveProfile = async (displayName: string, avatarBase64: string | null) => {
    if (!user) return;
    const profileData: UserProfile = {
      uid: user.uid,
      displayName,
      avatarBase64,
      googleEmail: user.email ?? '',
    };
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profileData,
        createdAt: new Date(),
        settings: { soundEnabled: true },
      });
    } catch {
      // offline fallback
    }
    localStorage.setItem(`profile-${user.uid}`, JSON.stringify(profileData));
    setProfile(profileData);
    setNeedsProfile(false);
  };

  return { user, profile, loading, needsProfile, signInWithGoogle, signOutUser, saveProfile };
}
