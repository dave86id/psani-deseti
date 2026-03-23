import { filterWords, pickWords } from './wordFilter';

/**
 * Generate a personalized exercise text based on characters where the user makes the most mistakes.
 * characterErrors: Record of char -> error count
 * allLetters: all letters available in the current context (to mix in)
 */
export function generateErrorExerciseText(
  errorsByChar: Record<string, number>,
  allLetters: string[],
  length = 60
): string {
  // Sort characters by error count descending
  const sortedErrors = Object.entries(errorsByChar)
    .filter(([char]) => char !== ' ') // Ignore spaces
    .sort((a, b) => b[1] - a[1]);

  if (sortedErrors.length === 0) {
    // Fallback if no errors recorded yet
    return generateSimpleSequence(allLetters.slice(0, 4), length);
  }

  // Take top 4 most problematic characters
  const problematicChars = sortedErrors.slice(0, 4).map(([char]) => char.toLowerCase());
  
  // Try to find words containing these characters
  const wordsWithErrors = filterWords(allLetters, 2, 8).filter(word => 
    problematicChars.some(char => word.toLowerCase().includes(char))
  );

  if (wordsWithErrors.length >= 5) {
    // Generate a mix of words and sequences
    const pickedWords = pickWords(wordsWithErrors, 10);
    return pickedWords.join(' ');
  }

  // If not enough words, generate sequences focusing on the problematic characters
  return generateErrorSequence(problematicChars, allLetters, length);
}

function generateErrorSequence(problemChars: string[], allChars: string[], length: number): string {
  const result: string[] = [];
  let groupCount = 0;

  while (result.join('').replace(/ /g, '').length < length) {
    // 70% chance to pick a problematic character, 30% chance for a random context character
    const isErrorChar = Math.random() < 0.7;
    const char = isErrorChar 
      ? problemChars[Math.floor(Math.random() * problemChars.length)]
      : allChars[Math.floor(Math.random() * allChars.length)];
    
    // Group of 2-4 same characters
    const groupLen = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < groupLen; i++) {
      result.push(char);
    }
    
    groupCount++;
    if (groupCount % 2 === 0) {
      result.push(' ');
    }
  }

  return result.join('').trim().slice(0, length * 1.5);
}

function generateSimpleSequence(letters: string[], length: number): string {
  const result: string[] = [];
  for (let i = 0; i < length / 2; i++) {
    result.push(letters[i % letters.length]);
    if (i % 3 === 0) result.push(' ');
  }
  return result.join('').trim();
}
