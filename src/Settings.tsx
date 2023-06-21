import React, { FC, useCallback, useContext, useState } from "react";
import { z } from "zod";
import { modals } from "@mantine/modals";
import {
  RangeSlider,
  Checkbox,
  Stack,
  Slider,
  Title,
  Group,
  Button,
} from "@mantine/core";

const settingsSchema = z.object({
  width: z.number().int().gte(2),
  height: z.number().int().gte(2),
  minWordLength: z.number().int().gte(1),
  maxWordLength: z.number().int().gte(2),
  blockMustHaveDefinition: z.boolean(),
  allLettersMustBeConnected: z.boolean(),
  blocksCanTouch: z.boolean(),
  allowWordsAlongFirstRowColumn: z.boolean(),
  blocksDensity: z.number().gte(0).lte(1),
  maxBlockIslandSize: z.number().int().gte(1),
  animation: z.number().int().gte(0),
});

export type Settings = z.infer<typeof settingsSchema>;

const defaultSettings: Settings = {
  width: 12,
  height: 12,
  blockMustHaveDefinition: true,
  maxWordLength: 12,
  minWordLength: 2,
  allLettersMustBeConnected: true,
  blocksCanTouch: false,
  allowWordsAlongFirstRowColumn: false,
  blocksDensity: 0.3,
  maxBlockIslandSize: 2,
  animation: 2,
};

const SettingsContext = React.createContext<{
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
}>({ settings: defaultSettings, setSettings: () => null });

export const SettingsProvider: FC<{ children?: any }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const setSettingsWrapper = useCallback(
    (s: Partial<Settings>) =>
      setSettings((settingsOld) => ({ ...settingsOld, ...s })),
    [setSettings]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings: setSettingsWrapper,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const { settings } = useContext(SettingsContext);

  return settings;
};

const SettingsModal = () => {
  const { settings, setSettings } = useContext(SettingsContext);

  return (
    <>
      <Stack spacing={"md"}>
        Grid ({settings.width}x{settings.height})
        <Slider
          value={settings.width}
          onChange={(width) => setSettings({ width })}
          min={2}
          max={20}
          marks={[{ value: 5 }, { value: 10 }, { value: 15 }, { value: 20 }]}
        />
        <Slider
          value={settings.height}
          onChange={(height) => setSettings({ height })}
          min={2}
          max={20}
          marks={[{ value: 5 }, { value: 10 }, { value: 15 }, { value: 20 }]}
        />
        Words length ({settings.minWordLength} - {settings.maxWordLength})
        <RangeSlider
          value={[settings.minWordLength, settings.maxWordLength]}
          onChange={([minWordLength, maxWordLength]) =>
            setSettings({ minWordLength, maxWordLength })
          }
          min={1}
          max={20}
          minRange={1}
          marks={[{ value: 5 }, { value: 10 }, { value: 15 }, { value: 20 }]}
        />
        Blocks density
        <Slider
          value={settings.blocksDensity}
          onChange={(blocksDensity) => setSettings({ blocksDensity })}
          min={0}
          max={1}
          marks={[{ value: 0.25 }, { value: 0.5 }, { value: 0.75 }]}
          step={0.01}
          label={(x) => Math.round(x * 100) + "%"}
        />
        Max block island size
        <Slider
          value={settings.maxBlockIslandSize}
          onChange={(maxBlockIslandSize) => setSettings({ maxBlockIslandSize })}
          min={1}
          max={20}
          marks={[{ value: 5 }, { value: 10 }, { value: 15 }]}
        />
        Animation delay
        <Slider
          value={settings.animation}
          onChange={(animation) => setSettings({ animation })}
          min={0}
          max={10}
          marks={[{ value: 5 }]}
        />
        <Checkbox
          checked={settings.allLettersMustBeConnected}
          onChange={(e) =>
            setSettings({ allLettersMustBeConnected: e.currentTarget.checked })
          }
          label="All bletters must be connected"
        />
        <Checkbox
          checked={settings.blockMustHaveDefinition}
          onChange={(e) =>
            setSettings({ blockMustHaveDefinition: e.currentTarget.checked })
          }
          label="All blocks must have a definition"
        />
        <Checkbox
          checked={settings.blocksCanTouch}
          onChange={(e) =>
            setSettings({ blocksCanTouch: e.currentTarget.checked })
          }
          label="Blocks can touch sides"
        />
        <Checkbox
          checked={settings.allowWordsAlongFirstRowColumn}
          onChange={(e) =>
            setSettings({
              allowWordsAlongFirstRowColumn: e.currentTarget.checked,
            })
          }
          label="Allow words along first row/column"
        />
      </Stack>
      <Group position="right" mt="sm">
        <Button variant="default" onClick={() => setSettings(defaultSettings)}>
          Default
        </Button>
        <Button onClick={() => modals.closeAll()}>Save</Button>
      </Group>
    </>
  );
};

export const useOpenSettingsModal = () => {
  return () => {
    modals.open({
      title: <Title order={3}>Settings</Title>,
      children: <SettingsModal />,
    });
  };
};
