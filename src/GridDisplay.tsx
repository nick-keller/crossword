import React, { CSSProperties, FC } from "react";
import { Grid } from "./Grid";
import "./grid.css";
import { CellDisplay } from "./CellDisplay";
import { modals } from "@mantine/modals";
import { Checkbox, SimpleGrid, Stack, Title } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { Cell } from "./Cell";

const EditCellModal: FC<{ grid: Grid; cell: Cell; render: () => void }> = ({
  grid,
  cell,
  render,
}) => {
  const [count, handlers] = useCounter();
  return (
    <SimpleGrid cols={3} m="lg">
      <Stack spacing="sm">
        <Checkbox
          checked={cell.isBlock}
          onChange={(e) => {
            cell.isBlock = e.currentTarget.checked;
            render();
            handlers.increment();
          }}
          label="Block"
        />
        <Checkbox
          checked={cell.isLetter}
          onChange={(e) => {
            cell.isLetter = e.currentTarget.checked;
            render();
            handlers.increment();
          }}
          label="Letter"
        />
      </Stack>
      <Stack spacing="xs">
        <div>Letters: {cell.lettersTop}</div>
        <div>Fixed letters: {cell.fixedLettersTop}</div>
        <div>Closest def: {cell.closestDefinitionFromTop}</div>
        <div>Number of def: {cell.numberDefinitionsFromTop}</div>
      </Stack>
      <div />
      <Stack spacing="xs">
        <div>Letters: {cell.lettersLeft}</div>
        <div>Fixed letters: {cell.fixedLettersLeft}</div>
        <div>Closest def: {cell.closestDefinitionFromLeft}</div>
        <div>Number of def: {cell.numberDefinitionsFromLeft}</div>
      </Stack>
      <div className="cell-container">
        <CellDisplay grid={grid} cell={cell} />
      </div>
      <Stack spacing="sm">
        <Checkbox
          checked={cell.arrowRightDown}
          onChange={(e) => {
            cell.arrowRightDown = e.currentTarget.checked;
            render();
            handlers.increment();
          }}
          label="Down"
        />
        <Checkbox
          checked={cell.arrowRightAcross}
          onChange={(e) => {
            cell.arrowRightAcross = e.currentTarget.checked;
            render();
            handlers.increment();
          }}
          label="Across"
        />
        <Checkbox
          checked={cell.arrowRightNone}
          onChange={(e) => {
            cell.arrowRightNone = e.currentTarget.checked;
            render();
            handlers.increment();
          }}
          label="None"
        />
        <div>Letters: {cell.lettersRight}</div>
        <div>Letters down: {cell.lettersRightDown}</div>
      </Stack>
      <div />
      <Stack spacing="sm">
        <Checkbox
          checked={cell.arrowBottomDown}
          onChange={(e) => {
            cell.arrowBottomDown = e.currentTarget.checked;
            render();
            handlers.increment();
          }}
          label="Down"
        />
        <Checkbox
          checked={cell.arrowBottomAcross}
          onChange={(e) => {
            cell.arrowBottomAcross = e.currentTarget.checked;
            render();
            handlers.increment();
          }}
          label="Across"
        />
        <Checkbox
          checked={cell.arrowBottomNone}
          onChange={(e) => {
            cell.arrowBottomNone = e.currentTarget.checked;
            render();
            handlers.increment();
          }}
          label="None"
        />
        <div>Letters: {cell.lettersBottom}</div>
        <div>Letters across: {cell.lettersBottomAcross}</div>
      </Stack>
    </SimpleGrid>
  );
};

export const GridDisplay: FC<{ grid: Grid }> = ({ grid }) => {
  const [count, handlers] = useCounter();
  return (
    <div
      className="grid"
      style={{ "--grid-width": grid.settings.width } as CSSProperties}
    >
      {grid.cells.map((cell) => (
        <CellDisplay
          onClick={() => {
            modals.open({
              title: <Title order={3}>Edit cell</Title>,
              size: "lg",
              children: (
                <EditCellModal
                  grid={grid}
                  cell={cell}
                  render={handlers.increment}
                />
              ),
            });
          }}
          key={`${cell.x}-${cell.y}`}
          grid={grid}
          cell={cell}
        />
      ))}
    </div>
  );
};
