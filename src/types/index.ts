export interface ExerciseResult {
  cpm: number;
  accuracy: number;
  errors: number;
  timeSeconds: number;
  characterErrors: Record<string, number>;
}

export interface ExerciseState {
  text: string;
  currentIndex: number;
  errors: Set<number>;
  startTime: number | null;
  isComplete: boolean;
  totalErrors: number;
  characterErrors: Record<string, number>;
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
  characterErrors: Record<string, number>;
}

export interface LessonProgress {
  completed: boolean;
  bestCpm: number;
  bestAccuracy: number;
  completedExercises: number[]; // exercise ids completed
  exerciseScores: Record<number, ExerciseScore>; // exerciseId -> last score
  characterErrors: Record<string, number>; // cumulative errors for this lesson
}

export interface UserProgress {
  lessons: Record<string, LessonProgress>;
  settings: {
    soundEnabled: boolean;
  };
}
