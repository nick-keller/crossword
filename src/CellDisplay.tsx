import { FC } from "react";
import { Grid } from "./Grid";
import clx from "classnames";
import { Cell } from "./Cell";

export const CellDisplay: FC<{
  grid: Grid;
  cell: Cell;
  onClick?: () => void;
}> = ({ grid, cell, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clx(`cell`, {
        top: cell.y === 0,
        left: cell.x === 0,
        right: cell.x === grid.settings.width - 1,
        bottom: cell.y === grid.settings.height - 1,
      })}
      style={{
        gridColumnStart: cell.x + 1,
        gridRowStart: cell.y + 1,
      }}
    >
      {cell.arrowBottomDown && (
        <div
          className={clx("arrow bottom down", cell.arrowBottomFixed && "fixed")}
        />
      )}
      {cell.arrowBottomAcross && (
        <div
          className={clx(
            "arrow bottom across",
            cell.arrowBottomFixed && "fixed"
          )}
        />
      )}
      {cell.arrowBottomError && <div className="arrow-bottom-error" />}
      {cell.arrowRightDown && (
        <div
          className={clx("arrow right down", cell.arrowRightFixed && "fixed")}
        />
      )}
      {cell.arrowRightAcross && (
        <div
          className={clx("arrow right across", cell.arrowRightFixed && "fixed")}
        />
      )}
      {cell.arrowRightError && <div className="arrow-right-error" />}
      <div
        className={clx({
          error: cell.typeError,
          block: cell.isBlock,
          letter: cell.isLetter,
        })}
      />
      {grid.updatedCells.has(cell) && <div className="updated-cell" />}
    </div>
  );
};
