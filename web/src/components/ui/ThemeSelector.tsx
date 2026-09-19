import React from 'react';

import { Badge, Button, Code, ColorInput, CopyButton, Divider, Group, Radio, Slider, Stack, Text } from '@mantine/core';

import { ThemeGallery, WidgetType, useMeasuredSize } from './ThemeGallery';
import { Time } from '../widget/Time';

type ThemeSelectorProps = {
  type: WidgetType;
  theme: string;
  onChangeTheme: (theme: string) => void;
  /** プレビューの下地。ウィジェットは透過なので背景が無いと見えない */
  background: string;
  /** 選択中テーマの大きいプレビュー。AppContext が要るので親から受け取る */
  children?: React.ReactNode;
};

export const ThemeSelector = ({ type, theme, onChangeTheme, background, children }: ThemeSelectorProps) => {
  // OBS に貼る URL はそのまま使えるものにする。
  // デモ表示はページ内の Data Source で切り替えるので、URL には混ぜない
  const url = window.location.origin + `/${type}?theme=${theme}`;
  const { size, onMeasure } = useMeasuredSize();

  return (
    <Stack gap="sm">
      {/*
        プレビューと URL を先に出す。テーマが増えると一覧が縦に伸びて、
        いちばん使う Copy URL が画面の下へ押し出されるため。
      */}
      {children}
      <Group gap="xs" align="center">
        <Text size="sm" fw={600}>
          URL:
        </Text>
        <Code style={{ flex: 1, fontSize: 15, padding: '8px 10px' }}>{url}</Code>
        <CopyButton value={url}>
          {({ copied, copy }) => (
            <Button variant={copied ? 'filled' : 'light'} color={copied ? 'teal' : 'blue'} size="sm" onClick={copy}>
              {copied ? 'Copied!' : 'Copy URL'}
            </Button>
          )}
        </CopyButton>
        <Button component="a" href={`/customize?w=${type}&theme=${theme}`} variant="subtle" size="sm">
          Customize...
        </Button>
      </Group>
      <Group gap="xs">
        <Text size="sm" c="dimmed">
          Add it as a Browser Source in OBS.
        </Text>
        {size && (
          <Badge size="sm" variant="light">
            size {size.width} x {size.height}
          </Badge>
        )}
      </Group>
      <Divider my="xs" />
      <ThemeGallery
        type={type}
        theme={theme}
        onChangeTheme={onChangeTheme}
        background={background}
        onMeasure={onMeasure}
      />
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
