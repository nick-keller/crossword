import { Settings } from "./Settings";
import { Cell } from "./Cell";
import { rules } from "./Rule";

export class Grid {
  private grid: Cell[][] = [];
  public updatedCells: Set<Cell> = new Set();
  public cellsThatCausedBacktracking: Map<Cell, number> = new Map();
  public updated = false;

  constructor(
    public settings: Settings,
    private render: () => Promise<void> | void
  ) {
    for (let x = 0; x < this.settings.width; x++) {
      const column: Cell[] = [];

      for (let y = 0; y < this.settings.height; y++) {
        column.push(
          new Cell(x, y, (cell) => {
            this.updatedCells.add(cell);
            this.updated = true;
          })
        );
      }

      this.grid.push(column);
    }

    if (!this.settings.allowWordsAlongFirstRowColumn) {
      for (let x = 0; x < this.settings.width; x++) {
        this.grid[x][0].arrowRightAcross = false;
      }
      for (let y = 0; y < this.settings.height; y++) {
        this.grid[0][y].arrowBottomDown = false;
      }
      this.updatedCells.clear();
    }
  }

  wasUpdated() {
    const updated = this.updated;
    this.updated = false;
    return updated;
  }

  cell(x: number, y: number): Cell | null {
    return x >= 0 &&
      y >= 0 &&
      x < this.settings.width &&
      y < this.settings.height
      ? this.grid[x][y]
      : null;
  }

  setCellProp<
    P extends
      | "arrowBottomDown"
      | "arrowBottomAcross"
      | "arrowBottomNone"
      | "arrowRightDown"
      | "arrowRightAcross"
      | "arrowRightNone"
      | "isLetter"
      | "isBlock"
      | "lettersRightDown"
      | "lettersBottomAcross"
  >(
    x: number,
    y: number,
    prop: P,
    value: P extends "lettersRightDown" | "lettersBottomAcross"
      ? number
      : boolean
  ) {
    const cell = this.cell(x, y);

    if (cell) {
      // @ts-ignore
      cell[prop] = value;
    }
  }

  get cells(): Cell[] {
    const cells: Cell[] = [];

    for (let x = 0; x < this.settings.width; x++) {
      for (let y = 0; y < this.settings.height; y++) {
        cells.push(this.grid[x][y]);
      }
    }

    return cells;
  }

  measure() {
    const maxWordLength = Math.min(
      this.settings.width,
      this.settings.maxWordLength
    );

    // Top
    for (let x = 0; x < this.settings.width; x++) {
      let lettersTop = 0;
      let fixedLettersTop = 0;
      let closestDefinitionFromTop = Infinity;
      let numberDefinitionsFromTopHistory: number[] = new Array(
        maxWordLength
      ).fill(0);

      for (let y = 0; y < this.settings.height; y++) {
        numberDefinitionsFromTopHistory = [
          0,
          ...numberDefinitionsFromTopHistory.slice(0, maxWordLength - 1),
        ];
        if (this.cell(x - 1, y)?.arrowRightDown) {
          closestDefinitionFromTop = 0;
          numberDefinitionsFromTopHistory[0]++;
        }
        if (this.cell(x, y - 1)?.arrowBottomDown) {
          numberDefinitionsFromTopHistory[0]++;
        }

        const cell = this.grid[x][y];

        const numberDefinitionsFromTop = numberDefinitionsFromTopHistory.reduce(
          (a, b) => a + b
        );
        cell.closestDefinitionFromTop =
          numberDefinitionsFromTop === 0 ? Infinity : closestDefinitionFromTop;
        cell.numberDefinitionsFromTop = numberDefinitionsFromTop;
        cell.lettersTop = lettersTop;
        cell.fixedLettersTop = fixedLettersTop;

        lettersTop = cell.isLetter ? lettersTop + 1 : 0;
        fixedLettersTop =
          cell.isLetter && !cell.isBlock ? fixedLettersTop + 1 : 0;

        if (!cell.isLetter) {
          numberDefinitionsFromTopHistory = new Array(maxWordLength).fill(0);
          closestDefinitionFromTop = Infinity;
        }

        if (cell.arrowBottomDown) {
          closestDefinitionFromTop = 0;
        } else if (cell.isLetter) {
          closestDefinitionFromTop++;
        }
      }
    }

    // Bottom
    for (let x = 0; x < this.settings.width; x++) {
      let bottom = 0;

      for (let y = this.settings.height - 1; y >= -1; y--) {
        this.setCellProp(x - 1, y + 1, "lettersRightDown", bottom);

        if (y >= 0) {
          const cell = this.grid[x][y];
          cell.lettersBottom = bottom;
          bottom = cell.isLetter ? bottom + 1 : 0;
        }
      }
    }

    // Left
    for (let y = 0; y < this.settings.height; y++) {
      let lettersLeft = 0;
      let fixedLettersLeft = 0;
      let closestDefinitionFromLeft = Infinity;
      let numberDefinitionsFromLeftHistory: number[] = new Array(
        maxWordLength
      ).fill(0);

      for (let x = 0; x < this.settings.width; x++) {
        numberDefinitionsFromLeftHistory = [
          0,
          ...numberDefinitionsFromLeftHistory.slice(0, maxWordLength - 1),
        ];
        if (this.cell(x, y - 1)?.arrowBottomAcross) {
          closestDefinitionFromLeft = 0;
          numberDefinitionsFromLeftHistory[0]++;
        }
        if (this.cell(x - 1, y)?.arrowRightAcross) {
          numberDefinitionsFromLeftHistory[0]++;
        }

        const cell = this.grid[x][y];

        const numberDefinitionsFromLeft =
          numberDefinitionsFromLeftHistory.reduce((a, b) => a + b);
        cell.closestDefinitionFromLeft =
          numberDefinitionsFromLeft === 0
            ? Infinity
            : closestDefinitionFromLeft;
        cell.numberDefinitionsFromLeft = numberDefinitionsFromLeft;
        cell.lettersLeft = lettersLeft;
        cell.fixedLettersLeft = fixedLettersLeft;

        lettersLeft = cell.isLetter ? lettersLeft + 1 : 0;
        fixedLettersLeft =
          cell.isLetter && !cell.isBlock ? fixedLettersLeft + 1 : 0;

        if (!cell.isLetter) {
          numberDefinitionsFromLeftHistory = new Array(maxWordLength).fill(0);
          closestDefinitionFromLeft = Infinity;
        }

        if (cell.arrowRightAcross) {
          closestDefinitionFromLeft = 0;
        } else if (cell.isLetter) {
          closestDefinitionFromLeft++;
        }
      }
    }

    // Right
    for (let y = 0; y < this.settings.height; y++) {
      let right = 0;

      for (let x = this.settings.width - 1; x >= -1; x--) {
        this.setCellProp(x + 1, y - 1, "lettersBottomAcross", right);

        if (x >= 0) {
          const cell = this.grid[x][y];
          cell.lettersRight = right;
          right = cell.isLetter ? right + 1 : 0;
        }
      }
    }
  }

  solve() {
    this.measure();
    this.updated = false;
    while (this.updatedCells.size) {
      const cell = this.updatedCells.values().next().value as Cell;
      this.updatedCells.delete(cell);

      for (const rule of rules) {
        rule.exec(cell, this);

        if (this.wasUpdated()) {
          this.measure();
          this.updatedCells.add(cell);
          break;
        }
      }

      if (cell.typeError || cell.arrowRightError || cell.arrowBottomError) {
        return false;
      }
    }

    return true;
  }

  leastEntropyNonFixedCell(): Cell | null {
    let cell: Cell | null = null;
    let entropy = 0;

    for (const c of this.cells) {
      const e = this.cellsThatCausedBacktracking.get(c) ?? 0;
      if (e > entropy && !c.typeFixed) {
        entropy = e;
        cell = c;
      }
    }

    if (cell) {
      return cell;
    }

    entropy = Infinity;

    for (const c of this.cells) {
      const e = c.entropy(this.settings);
      if (e < entropy && !c.typeFixed) {
        entropy = e;
        cell = c;
      }
    }

    return cell;
  }

  saveState() {
    return {
      grid: JSON.stringify(this.grid),
      updatedCells: [...this.updatedCells],
    };
  }

  restoreState(state: { grid: string; updatedCells: Cell[] }) {
    const data = JSON.parse(state.grid);

    for (let x = 0; x < this.settings.width; x++) {
      for (let y = 0; y < this.settings.height; y++) {
        for (const key in data[x][y]) {
          // @ts-ignore
          this.grid[x][y][key] = data[x][y][key];
        }
      }
    }

    this.updatedCells = new Set(state.updatedCells);
  }

  async collapse() {
    const success = this.solve();
    await this.render();

    if (!success) {
      return false;
    }

    let cell = this.leastEntropyNonFixedCell();

    if (cell) {
      const state = this.saveState();

      const shouldBeBlock = Math.random() < this.settings.blocksDensity;

      if (shouldBeBlock) {
        cell.isLetter = false;
      } else {
        cell.isBlock = false;
      }

      const success = await this.collapse();

      if (!success) {
        this.restoreState(state);

        if (shouldBeBlock) {
          cell.isBlock = false;
        } else {
          cell.isLetter = false;
        }

        const success = await this.collapse();

        if (!success) {
          this.cellsThatCausedBacktracking.set(
            cell,
            (this.cellsThatCausedBacktracking.get(cell) ?? 0) + 1
          );
          return false;
        }
      }
    }

    return true;
  }
}
