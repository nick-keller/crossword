import { Cell } from "./Cell";
import { Grid } from "./Grid";

export interface Rule {
  exec(cell: Cell, grid: Grid): void;
}

export const rules: Rule[] = [
  {
    // Not enough letters for word
    exec(cell, grid) {
      if (cell.lettersBottom < grid.settings.minWordLength) {
        cell.arrowBottomDown = false;
      }

      if (cell.lettersRight < grid.settings.minWordLength) {
        cell.arrowRightAcross = false;
      }

      if (cell.lettersBottomAcross < grid.settings.minWordLength) {
        cell.arrowBottomAcross = false;
      }

      if (cell.lettersRightDown < grid.settings.minWordLength) {
        cell.arrowRightDown = false;
      }

      if (cell.lettersBottom === 0) {
        cell.arrowBottomAcross = false;
        cell.arrowBottomDown = false;
      }

      if (cell.lettersRight === 0) {
        cell.arrowRightAcross = false;
        cell.arrowRightDown = false;
      }
    },
  },
  {
    // Arrow-less cells cannot be blocks
    exec(cell, grid) {
      if (grid.settings.blockMustHaveDefinition && cell.numberOfArrows === 0) {
        cell.isBlock = false;
      }
    },
  },
  {
    // Non blocks cannot have arrows
    exec(cell) {
      if (!cell.isBlock) {
        cell.arrowRightDown = false;
        cell.arrowRightAcross = false;
        cell.arrowBottomDown = false;
        cell.arrowBottomAcross = false;
      }
    },
  },
  {
    // Blocks with exactly one arrow must have this arrow
    exec(cell, grid) {
      if (
        grid.settings.blockMustHaveDefinition &&
        !cell.isLetter &&
        cell.numberOfArrows === 1
      ) {
        if (cell.arrowBottomAcross || cell.arrowBottomDown) {
          cell.arrowBottomNone = false;
        } else {
          cell.arrowRightNone = false;
        }
      }
    },
  },
  {
    // Cells with no definitions cannot be letters
    exec(cell) {
      if (cell.numberOfDefinitions === 0) {
        cell.isLetter = false;
      }
    },
  },
  {
    // Cells with arrows cannot be letters
    exec(cell) {
      if (!cell.arrowBottomNone && !cell.arrowRightNone) {
        cell.isLetter = false;
      }
    },
  },
  {
    // Arrow should point to enough letters
    exec(cell: Cell, grid: Grid) {
      if (cell.arrowBottomFixed && !cell.arrowBottomNone) {
        const c = grid.cell(cell.x, cell.y + 1)!;

        for (let i = 0; i < grid.settings.minWordLength; i++) {
          grid.setCellProp(
            c.x + i * Number(cell.arrowBottomAcross),
            c.y + i * Number(cell.arrowBottomDown),
            "isBlock",
            false
          );
        }
      }

      if (cell.arrowRightFixed && !cell.arrowRightNone) {
        const c = grid.cell(cell.x + 1, cell.y)!;

        for (let i = 0; i < grid.settings.minWordLength; i++) {
          grid.setCellProp(
            c.x + i * Number(cell.arrowRightAcross),
            c.y + i * Number(cell.arrowRightDown),
            "isBlock",
            false
          );
        }
      }
    },
  },
  {
    // Blocks cannot touch other blocks
    exec(cell, grid) {
      if (cell.isBlock && !cell.isLetter && !grid.settings.blocksCanTouch) {
        grid.setCellProp(cell.x, cell.y - 1, "isBlock", false);
        grid.setCellProp(cell.x + 1, cell.y, "isBlock", false);
        grid.setCellProp(cell.x, cell.y + 1, "isBlock", false);
        grid.setCellProp(cell.x - 1, cell.y, "isBlock", false);
      }
    },
  },
  {
    exec(cell, grid) {
      if (
        !cell.isBlock &&
        (cell.numberOfDefinitions === 1 ||
          (cell.fixedLettersTop + 1 >= grid.settings.minWordLength &&
            cell.numberDefinitionsFromTop === 1) ||
          (cell.fixedLettersLeft + 1 >= grid.settings.minWordLength &&
            cell.numberDefinitionsFromLeft === 1))
      ) {
        if (
          cell.numberDefinitionsFromTop === 1 &&
          (cell.numberDefinitionsFromLeft === 0 ||
            cell.fixedLettersTop + 1 >= grid.settings.minWordLength)
        ) {
          let c = grid.cell(cell.x, cell.y - 1 - cell.closestDefinitionFromTop);
          if (c?.arrowBottomDown) {
            c.arrowBottomAcross = false;
            c.arrowBottomNone = false;
          } else {
            c = grid.cell(cell.x - 1, cell.y - cell.closestDefinitionFromTop);

            if (c?.arrowRightDown) {
              c.arrowRightAcross = false;
              c.arrowRightNone = false;
            } else {
              cell.isLetter = false;
            }
          }
        }

        if (
          cell.numberDefinitionsFromLeft === 1 &&
          (cell.numberDefinitionsFromTop === 0 ||
            cell.fixedLettersLeft + 1 >= grid.settings.minWordLength)
        ) {
          let c = grid.cell(
            cell.x - 1 - cell.closestDefinitionFromLeft,
            cell.y
          );
          if (c?.arrowRightAcross) {
            c.arrowRightDown = false;
            c.arrowRightNone = false;
          } else {
            c = grid.cell(cell.x - cell.closestDefinitionFromLeft, cell.y - 1)!;
            if (c?.arrowBottomAcross) {
              c.arrowBottomDown = false;
              c.arrowBottomNone = false;
            } else {
              cell.isLetter = false;
            }
          }
        }
      }
    },
  },
  {
    exec(cell, grid) {
      if (
        !cell.isBlock &&
        cell.closestDefinitionFromTop < grid.settings.maxWordLength &&
        (cell.numberDefinitionsFromLeft === 0 ||
          cell.fixedLettersTop + 1 >= grid.settings.minWordLength)
      ) {
        for (let i = 0; i < cell.closestDefinitionFromTop; i++) {
          grid.setCellProp(cell.x, cell.y - i - 1, "isBlock", false);
        }
      }
      if (
        !cell.isBlock &&
        cell.closestDefinitionFromLeft < grid.settings.maxWordLength &&
        (cell.numberDefinitionsFromTop === 0 ||
          cell.fixedLettersLeft + 1 >= grid.settings.minWordLength)
      ) {
        for (let i = 0; i < cell.closestDefinitionFromLeft; i++) {
          grid.setCellProp(cell.x - i - 1, cell.y, "isBlock", false);
        }
      }
    },
  },
  {
    exec(cell, grid) {
      if (
        cell.fixedLettersTop + 1 >= grid.settings.minWordLength &&
        cell.closestDefinitionFromTop > grid.settings.maxWordLength
      ) {
        cell.isLetter = false;
      }

      if (
        cell.fixedLettersLeft + 1 >= grid.settings.minWordLength &&
        cell.closestDefinitionFromLeft > grid.settings.maxWordLength
      ) {
        cell.isLetter = false;
      }
    },
  },
  {
    // Word must pass through
    exec(cell: Cell, grid: Grid) {
      if (
        cell.isLetter &&
        !cell.isBlock &&
        cell.lettersLeft + 1 + cell.lettersRight < grid.settings.minWordLength
      ) {
        for (
          let i = 1;
          i < grid.settings.minWordLength - cell.lettersTop;
          i++
        ) {
          grid.setCellProp(cell.x, cell.y + i, "isBlock", false);
        }

        for (
          let i = 1;
          i < grid.settings.minWordLength - cell.lettersBottom;
          i++
        ) {
          grid.setCellProp(cell.x, cell.y - i, "isBlock", false);
        }
      }

      if (
        cell.isLetter &&
        !cell.isBlock &&
        cell.lettersTop + 1 + cell.lettersBottom < grid.settings.minWordLength
      ) {
        for (
          let i = 1;
          i < grid.settings.minWordLength - cell.lettersLeft;
          i++
        ) {
          grid.setCellProp(cell.x + i, cell.y, "isBlock", false);
        }

        for (
          let i = 1;
          i < grid.settings.minWordLength - cell.lettersRight;
          i++
        ) {
          grid.setCellProp(cell.x - i, cell.y, "isBlock", false);
        }
      }
    },
  },
];
