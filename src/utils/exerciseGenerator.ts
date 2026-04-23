import { filterWords, pickWords } from './wordFilter';

/**
 * Generate a sequence of characters/words for an exercise.
 * exerciseNum: 1-based index within the lesson (1 = easiest)
 * totalExercises: total count in lesson
 */
export function generateExerciseText(
  newLetters: string[],
  allLetters: string[],
  exerciseNum: number
): string {
  const nl = newLetters.map(l => l.toLowerCase());
  const al = allLetters.map(l => l.toLowerCase());

  if (exerciseNum <= 2) {
    // Phase 1: only new letters, repeated and alternated
    return generateLetterSequence(nl, 52);
  } else if (exerciseNum <= 4) {
    // Phase 2: mix new + all known, groups of 3-4
    return generateLetterSequence(al, 65);
  } else if (exerciseNum <= 6) {
    // Phase 3: try words, fallback to sequences
    const words = filterWords(al, 2, 6);
    if (words.length >= 3) {
      return pickWords(words, 16).join(' ');
    }
    return generateLetterSequence(al, 65);
  } else if (exerciseNum <= 9) {
    // Phase 4: words, up to 8 chars
    const words = filterWords(al, 2, 8);
    if (words.length >= 3) {
      return pickWords(words, 13).join(' ');
    }
    return generateLetterSequence(al, 65);
  } else {
    // Phase 5: longer words and phrases
    const words = filterWords(al, 3, 12);
    if (words.length >= 3) {
      return pickWords(words, 10).join(' ');
    }
    return generateLetterSequence(al, 78);
  }
}

function generateLetterSequence(letters: string[], length: number): string {
  if (letters.length === 0) return 'fjfj fjfj fjfj';

  const result: string[] = [];
  let i = 0;
  let groupLen = 1;
  let groupCount = 0;

  while (result.join('').replace(/ /g, '').length < length) {
    // Add a group of same letter
    const letter = letters[i % letters.length];
    for (let g = 0; g < groupLen; g++) {
      result.push(letter);
    }
    i++;
    groupCount++;

    // Add space every 3-5 groups
    if (groupCount % (2 + Math.floor(Math.random() * 3)) === 0) {
      result.push(' ');
      // Gradually increase group length
      if (groupLen < 4 && groupCount % 6 === 0) groupLen++;
    }
  }

  return result.join('').trim().slice(0, Math.floor(length * 1.2));
}
