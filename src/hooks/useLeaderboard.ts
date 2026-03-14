import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, setDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  avatarBase64: string | null;
  completedLessons: number;
  totalExercises: number;
  avgAccuracy: number;
  avgCpm: number;
  totalTime: number;
  score: number;
  updatedAt: Date;
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ uid: d.id, ...d.data() } as LeaderboardEntry));
      setEntries(data);
    } catch {
      // offline or not configured yet
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  const updateLeaderboard = useCallback(async (entry: Omit<LeaderboardEntry, 'updatedAt'>) => {
    try {
      await setDoc(doc(db, 'leaderboard', entry.uid), {
        ...entry,
        updatedAt: new Date(),
      });
    } catch {
      // offline
    }
  }, []);

  return { entries, loading, updateLeaderboard, refresh: fetchLeaderboard };
}
