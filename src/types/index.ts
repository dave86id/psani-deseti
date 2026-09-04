export interface ExerciseResult {
  cpm: number;
  accuracy: number;
  errors: number;
  timeSeconds: number;
  errorsByChar: Record<string, number>;
  // How often each character was the expected one. Needed to rank problem
  // characters by error rate rather than raw count — rare keys (capitals,
  // punctuation) would never win on raw count alone.
  attemptsByChar: Record<string, number>;
}

export interface ExerciseState {
  text: string;
  currentIndex: number;
  totalErrors: number;
  errorsByChar: Record<string, number>;
  attemptsByChar: Record<string, number>;
  errors: Set<number>;
  status: 'idle' | 'running' | 'completed';
}

export interface KeyDef {
  label: string;
  key: string;
  shift?: string;
  altChar?: string;
  wide?: boolean;
  extraWide?: boolean;
}

export interface SubLesson {
  id: number;
  text: string; // the text to type in this exercise
}

export interface Lesson {
  id: string;           // e.g. "1.1"
  title: string;        // e.g. "F a J"
  newLetters: string[]; // newly introduced letters
  allLetters: string[]; // all letters available in this lesson
  exercises: SubLesson[];
}

export interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface ExerciseScore {
  cpm: number;
  accuracy: number;
  errors: number;
  timeSeconds: number;
  errorsByChar: Record<string, number>;
}

export interface LessonProgress {
  id: string;
  bestCpm: number;
  bestAccuracy: number;
  completedExercises: number[]; // exercise ids completed
  completed: boolean;
  exerciseScores: Record<number, ExerciseScore>; // exerciseId -> last score
  errorsByChar: Record<string, number>; // cumulative errors for this lesson
  attemptsByChar?: Record<string, number>; // cumulative attempts (absent in older saved progress)
}

export interface UserProgress {
  lessons: Record<string, LessonProgress>;
  settings: {
    soundEnabled: boolean;
  };
}
