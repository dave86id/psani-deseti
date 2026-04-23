import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'psani-deseti-daily';
const GOAL_SECONDS = 600; // 10 minutes

interface DailyGoalData {
  date: string;
  seconds: number;
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadDailyGoal(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data: DailyGoalData = JSON.parse(raw);
      if (data.date === getTodayString()) {
        return Math.min(data.seconds, GOAL_SECONDS);
      }
    }
  } catch {
    // ignore
  }
  return 0;
}

function saveDailyGoal(seconds: number) {
  try {
    const data: DailyGoalData = { date: getTodayString(), seconds };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useDailyGoal(isActive: boolean): { elapsedSeconds: number; isComplete: boolean } {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(loadDailyGoal);
  const isComplete = elapsedSeconds >= GOAL_SECONDS;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive || isComplete) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = Math.min(prev + 1, GOAL_SECONDS);
        saveDailyGoal(next);
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isComplete]);

  return { elapsedSeconds, isComplete };
}
