import { useCallback, useRef } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProgress } from '../types';

export function useFirestoreProgress(uid: string | null) {
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncToFirestore = useCallback(async (progress: UserProgress) => {
    if (!uid) return;
    // Debounce — sync at most every 3s
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await setDoc(doc(db, 'users', uid, 'progress', 'data'), { lessons: progress.lessons });
      } catch {
        // offline — localStorage already saved by useProgress
      }
    }, 3000);
  }, [uid]);

  const loadFromFirestore = useCallback(async (): Promise<Partial<UserProgress> | null> => {
    if (!uid) return null;
    try {
      const snap = await getDoc(doc(db, 'users', uid, 'progress', 'data'));
      if (snap.exists()) return snap.data() as Partial<UserProgress>;
    } catch {
      // offline
    }
    return null;
  }, [uid]);

  return { syncToFirestore, loadFromFirestore };
}
