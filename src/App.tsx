import { MantineProvider, Button, ActionIcon, Flex } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";
import { ModalsProvider } from "@mantine/modals";
import {
  SettingsProvider,
  useOpenSettingsModal,
  useSettings,
} from "./Settings";
import { useState } from "react";
import { Grid } from "./Grid";
import { useCounter } from "@mantine/hooks";
import { GridDisplay } from "./GridDisplay";
import "./global.css";
import GithubCorner from "react-github-corner";

const X = () => {
  const settings = useSettings();
  const [count, handlers] = useCounter();
  const render = (): Promise<void> => {
    handlers.increment();

    if (settings.animation === 0) {
      return new Promise((resolve) => setTimeout(resolve, 1));
    }

    return new Promise((resolve) =>
      setTimeout(
        resolve,
        (settings.animation * 1000) / (settings.width * settings.height)
      )
    );
  };
  const [grid, setGrid] = useState(() => new Grid(settings, render));
  const openSettings = useOpenSettingsModal();

  return (
    <>
      <Flex gap="md" align="center" direction={{ base: "column", sm: "row" }}>
        <ActionIcon
          color="blue"
          size="lg"
          variant="light"
          onClick={openSettings}
        >
          <IconAdjustments />
        </ActionIcon>
        <Button
          onClick={() => setGrid(new Grid(settings, render))}
          variant={settings === grid.settings ? "outline" : "filled"}
          color={settings === grid.settings ? undefined : "green"}
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            console.time("solve");
            grid.solve(true);
            console.timeEnd("solve");
            handlers.increment();
          }}
        >
          Apply constraints
        </Button>
        <Button
          onClick={async () => {
            if (!(await grid.collapse(true))) {
              grid.updatedCells.clear();
            } else {
              await grid.collapseWords(true);
            }
            handlers.increment();
          }}
        >
          Collapse
        </Button>
        {grid.error && (
          <div style={{ color: "#962411" }}>Impossible constraints</div>
        )}
      </Flex>
      <GridDisplay grid={grid} />
    </>
  );
};

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <SettingsProvider>
        <ModalsProvider>
          <GithubCorner href="https://github.com/nick-keller/crossword" />
          <div className="container">
            <X />
          </div>
        </ModalsProvider>
      </SettingsProvider>
    </MantineProvider>
  );
}
