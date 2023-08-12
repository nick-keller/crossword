import { Cell } from "./Cell";
import words from "./nytcrosswords.json";

export const collapseWords = (cells: Cell[]) => {
  const possibleWords: Set<string>[] = new Array(cells.length)
    .fill(0)
    .map(() => new Set());

  // @ts-ignore
  for (const word in words[String(cells.length)]) {
    if (cells.every((cell, i) => cell.letters.has(word[i]))) {
      cells.forEach((_, i) => possibleWords[i].add(word[i]));
    }
  }

  let updated = false;
  cells.forEach((cell, i) => {
    if (cell.letters.size !== possibleWords[i].size) {
      updated = true;
    }

    if (possibleWords[i].size === 0) {
      throw new Error();
    }

    cell.letters = possibleWords[i];
  });

  return updated;
};
