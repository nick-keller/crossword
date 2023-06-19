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

const X = () => {
  const settings = useSettings();
  const [count, handlers] = useCounter();
  const render = (): Promise<void> => {
    handlers.increment();
    return new Promise((resolve) =>
      setTimeout(resolve, 2000 / (settings.width * settings.height))
    );
  };
  const [grid, setGrid] = useState(() => new Grid(settings, render));
  const openSettings = useOpenSettingsModal();
  const [error, setError] = useState<boolean>(false);

  return (
    <>
      <Flex gap="md" align="center">
        <ActionIcon
          color="blue"
          size="lg"
          variant="light"
          onClick={openSettings}
        >
          <IconAdjustments />
        </ActionIcon>
        <Button
          onClick={() => {
            setGrid(new Grid(settings, render));
            setError(false);
          }}
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            console.time("solve");
            grid.solve();
            console.timeEnd("solve");
            handlers.increment();
          }}
        >
          Apply constraints
        </Button>
        <Button
          onClick={async () => {
            setError(false);
            if (!(await grid.collapse())) {
              setError(true);
              grid.updatedCells.clear();
            }
            handlers.increment();
          }}
        >
          Collapse
        </Button>
        {error && (
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
          <div className="container">
            <X />
          </div>
        </ModalsProvider>
      </SettingsProvider>
    </MantineProvider>
  );
}
