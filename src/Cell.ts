import { Settings } from "./Settings";

export class Cell {
  private _arrowBottomDown: boolean = true;
  private _arrowBottomAcross: boolean = true;
  private _arrowBottomNone: boolean = true;
  private _arrowRightDown: boolean = true;
  private _arrowRightAcross: boolean = true;
  private _arrowRightNone: boolean = true;
  private _isLetter: boolean = true;
  private _isBlock: boolean = true;
  private _closestDefinitionFromTop: number = 0;
  private _closestDefinitionFromLeft: number = 0;
  private _numberDefinitionsFromTop: number = 0;
  private _numberDefinitionsFromLeft: number = 0;
  private _lettersRight: number = Infinity;
  private _lettersRightDown: number = Infinity;
  private _lettersBottom: number = Infinity;
  private _lettersBottomAcross: number = Infinity;
  private _lettersLeft: number = Infinity;
  private _lettersTop: number = Infinity;
  private _fixedLettersTop: number = 0;
  private _fixedLettersLeft: number = 0;

  constructor(
    public x: number,
    public y: number,
    private onUpdated: (cell: Cell) => void = () => null
  ) {
    if (x > 0) {
      this._arrowBottomAcross = false;
    }
    if (y > 0) {
      this._arrowRightDown = false;
    }
  }

  entropy(settings: Settings) {
    const size = settings.width + settings.height;
    const ratio = (x: number, reverse = false) =>
      reverse ? 1 - Math.min(1, x / size) : Math.min(1, x / size);

    return (
      ratio(this.x + this.y) *
      ratio(this._fixedLettersTop + this._fixedLettersLeft, true)
    );
  }

  get numberOfArrows() {
    return (
      Number(this._arrowBottomAcross) +
      Number(this._arrowBottomDown) +
      Number(this._arrowRightAcross) +
      Number(this._arrowRightDown)
    );
  }

  get numberOfDefinitions() {
    return this._numberDefinitionsFromTop + this._numberDefinitionsFromLeft;
  }

  get typeError() {
    return !this._isLetter && !this._isBlock;
  }

  get arrowBottomError() {
    return (
      !this._arrowBottomDown &&
      !this._arrowBottomAcross &&
      !this._arrowBottomNone
    );
  }

  get arrowRightError() {
    return (
      !this._arrowRightDown && !this._arrowRightAcross && !this._arrowRightNone
    );
  }

  get arrowBottomFixed() {
    return (
      Number(this._arrowBottomDown) +
        Number(this._arrowBottomAcross) +
        Number(this._arrowBottomNone) <=
      1
    );
  }

  get arrowRightFixed() {
    return (
      Number(this._arrowRightDown) +
        Number(this._arrowRightAcross) +
        Number(this._arrowRightNone) <=
      1
    );
  }

  get typeFixed() {
    return !this._isLetter || !this._isBlock;
  }

  get arrowBottomDown() {
    return this._arrowBottomDown;
  }

  get arrowBottomAcross() {
    return this._arrowBottomAcross;
  }

  get arrowBottomNone() {
    return this._arrowBottomNone;
  }

  get arrowRightDown() {
    return this._arrowRightDown;
  }

  get arrowRightAcross() {
    return this._arrowRightAcross;
  }

  get arrowRightNone() {
    return this._arrowRightNone;
  }

  get isLetter() {
    return this._isLetter;
  }

  get isBlock() {
    return this._isBlock;
  }

  get closestDefinitionFromTop() {
    return this._closestDefinitionFromTop;
  }

  get closestDefinitionFromLeft() {
    return this._closestDefinitionFromLeft;
  }

  get numberDefinitionsFromTop() {
    return this._numberDefinitionsFromTop;
  }

  get numberDefinitionsFromLeft() {
    return this._numberDefinitionsFromLeft;
  }

  get lettersRight() {
    return this._lettersRight;
  }

  get lettersBottom() {
    return this._lettersBottom;
  }

  get lettersLeft() {
    return this._lettersLeft;
  }

  get lettersTop() {
    return this._lettersTop;
  }

  get lettersRightDown() {
    return this._lettersRightDown;
  }

  get lettersBottomAcross() {
    return this._lettersBottomAcross;
  }

  get fixedLettersTop() {
    return this._fixedLettersTop;
  }

  get fixedLettersLeft() {
    return this._fixedLettersLeft;
  }

  set arrowBottomDown(arrowBottomDown: boolean) {
    if (this._arrowBottomDown !== arrowBottomDown) {
      this._arrowBottomDown = arrowBottomDown;
      this.onUpdated(this);
    }
  }

  set arrowBottomAcross(arrowBottomAcross: boolean) {
    if (this._arrowBottomAcross !== arrowBottomAcross) {
      this._arrowBottomAcross = arrowBottomAcross;
      this.onUpdated(this);
    }
  }

  set arrowBottomNone(arrowBottomNone: boolean) {
    if (this._arrowBottomNone !== arrowBottomNone) {
      this._arrowBottomNone = arrowBottomNone;
      this.onUpdated(this);
    }
  }

  set arrowRightDown(arrowRightDown: boolean) {
    if (this._arrowRightDown !== arrowRightDown) {
      this._arrowRightDown = arrowRightDown;
      this.onUpdated(this);
    }
  }

  set arrowRightAcross(arrowRightAcross: boolean) {
    if (this._arrowRightAcross !== arrowRightAcross) {
      this._arrowRightAcross = arrowRightAcross;
      this.onUpdated(this);
    }
  }

  set arrowRightNone(arrowRightNone: boolean) {
    if (this._arrowRightNone !== arrowRightNone) {
      this._arrowRightNone = arrowRightNone;
      this.onUpdated(this);
    }
  }

  set isLetter(isLetter: boolean) {
    if (this._isLetter !== isLetter) {
      this._isLetter = isLetter;
      this.onUpdated(this);
    }
  }

  set isBlock(isBlock: boolean) {
    if (this._isBlock !== isBlock) {
      this._isBlock = isBlock;
      this.onUpdated(this);
    }
  }

  set closestDefinitionFromTop(closestDefinitionFromTop: number) {
    if (this._closestDefinitionFromTop !== closestDefinitionFromTop) {
      this._closestDefinitionFromTop = closestDefinitionFromTop;
      this.onUpdated(this);
    }
  }

  set closestDefinitionFromLeft(closestDefinitionFromLeft: number) {
    if (this._closestDefinitionFromLeft !== closestDefinitionFromLeft) {
      this._closestDefinitionFromLeft = closestDefinitionFromLeft;
      this.onUpdated(this);
    }
  }

  set numberDefinitionsFromTop(numberDefinitionsFromTop: number) {
    if (this._numberDefinitionsFromTop !== numberDefinitionsFromTop) {
      this._numberDefinitionsFromTop = numberDefinitionsFromTop;
      this.onUpdated(this);
    }
  }

  set numberDefinitionsFromLeft(numberDefinitionsFromLeft: number) {
    if (this._numberDefinitionsFromLeft !== numberDefinitionsFromLeft) {
      this._numberDefinitionsFromLeft = numberDefinitionsFromLeft;
      this.onUpdated(this);
    }
  }

  set lettersRight(lettersRight: number) {
    if (this._lettersRight !== lettersRight) {
      this._lettersRight = lettersRight;
      this.onUpdated(this);
    }
  }

  set lettersBottom(lettersBottom: number) {
    if (this._lettersBottom !== lettersBottom) {
      this._lettersBottom = lettersBottom;
      this.onUpdated(this);
    }
  }

  set lettersLeft(lettersLeft: number) {
    if (this._lettersLeft !== lettersLeft) {
      this._lettersLeft = lettersLeft;
      this.onUpdated(this);
    }
  }

  set lettersTop(lettersTop: number) {
    if (this._lettersTop !== lettersTop) {
      this._lettersTop = lettersTop;
      this.onUpdated(this);
    }
  }

  set lettersRightDown(lettersRightDown: number) {
    if (this._lettersRightDown !== lettersRightDown) {
      this._lettersRightDown = lettersRightDown;
      this.onUpdated(this);
    }
  }

  set lettersBottomAcross(lettersBottomAcross: number) {
    if (this._lettersBottomAcross !== lettersBottomAcross) {
      this._lettersBottomAcross = lettersBottomAcross;
      this.onUpdated(this);
    }
  }

  set fixedLettersTop(fixedLettersTop: number) {
    if (this._fixedLettersTop !== fixedLettersTop) {
      this._fixedLettersTop = fixedLettersTop;
      this.onUpdated(this);
    }
  }

  set fixedLettersLeft(fixedLettersLeft: number) {
    if (this._fixedLettersLeft !== fixedLettersLeft) {
      this._fixedLettersLeft = fixedLettersLeft;
      this.onUpdated(this);
    }
  }
}
