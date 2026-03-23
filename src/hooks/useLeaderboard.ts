/* eslint-disable */
/* eslint-disable */
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, setDoc, doc, query } from 'firebase/firestore';
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
    setLoading(true);
    try {
      // No orderBy to avoid requiring a Firestore composite index — sort client-side
      const snap = await getDocs(query(collection(db, 'leaderboard')));
      const data = snap.docs
        .map(d => ({ uid: d.id, ...d.data() } as LeaderboardEntry))
        .sort((a, b) => b.score - a.score);
      setEntries(data);
    } catch {
      // Ignore leaderboard errors
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    if (active) {
      fetchLeaderboard();
    }
    return () => { active = false; };
  }, [fetchLeaderboard]);

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
