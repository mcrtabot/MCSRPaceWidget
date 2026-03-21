import React from 'react';

import { Button, Code, ColorInput, CopyButton, Group, Radio, Select, Slider, Stack, Text } from '@mantine/core';

import { useThemes } from '../../hooks';
import { Theme } from '../../types';
import { Time } from '../widget/Time';

type ThemeSelectorProps = {
  type: 'timeline' | 'indicator';
  theme: string;
  onChangeTheme: (theme: string) => void;
};

export const ThemeSelector = ({ type, theme, onChangeTheme }: ThemeSelectorProps) => {
  const { data: themes = [] } = useThemes();

  const baseURL = window.location.origin + `/${type}?theme=${theme}`;
  const demoURL = baseURL + '&demo=1';

  const themeOptions = themes.filter((item) => item[type]).map((t: Theme) => ({ value: t.name, label: t.name }));

  return (
    <Stack gap="sm">
      <Group align="flex-end">
        <Select label="Theme" value={theme} onChange={(val) => val && onChangeTheme(val)} data={themeOptions} w={360} />
      </Group>
      <Group gap="xs" align="center">
        <Text size="sm" fw={600}>
          URL:
        </Text>
        <Code style={{ flex: 1, fontSize: 13, padding: '6px 8px' }}>
          {baseURL}
          <span style={{ color: 'var(--mantine-color-red-6)' }}>&demo=1</span>
        </Code>
        <CopyButton value={demoURL}>
          {({ copied, copy }) => (
            <Button variant={copied ? 'filled' : 'light'} color={copied ? 'teal' : 'blue'} size="xs" onClick={copy}>
              {copied ? 'Copied!' : 'Copy URL'}
            </Button>
          )}
        </CopyButton>
      </Group>
      <Text size="xs" c="red" fw={700}>
        * "&demo=1" is a parameter for display in demo data. After checking, delete "&demo=1" from the URL.
      </Text>
    </Stack>
  );
};

type ThemeSelectorConditionProps = {
  igt: number;
  onChangeIGT: (pos: number) => void;
  bgColor: string;
  onChangeBgColor: (bgColor: string) => void;
  dataType: 'demo' | 'actual';
  onChangeDataType: (dataType: 'demo' | 'actual') => void;
};

export const ThemeSelectorCondition = ({
  igt,
  onChangeIGT,
  bgColor,
  onChangeBgColor,
  dataType,
  onChangeDataType,
}: ThemeSelectorConditionProps) => {
  return (
    <Stack gap="md">
      <ColorInput label="Background" value={bgColor} onChange={onChangeBgColor} />
      <Radio.Group label="Data Source" value={dataType} onChange={(val) => onChangeDataType(val as 'demo' | 'actual')}>
        <Stack mt="xs" gap="xs">
          <Radio value="demo" label="Demo" />
          <Radio value="actual" label="Actual" />
        </Stack>
      </Radio.Group>
      {dataType === 'demo' && (
        <div>
          <Group gap="sm" mb={4}>
            <Text size="sm" fw={600}>
              IGT:
            </Text>
            <Time value={igt * 1000} />
          </Group>
          <Slider value={igt} onChange={onChangeIGT} min={0} max={1500} />
        </div>
      )}
    </Stack>
  );
};
