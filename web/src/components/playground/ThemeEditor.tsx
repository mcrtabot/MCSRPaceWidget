import React, { useMemo } from 'react';

import { Badge, Box, Button, CopyButton, Group, ScrollArea, Stack, Text, TextInput } from '@mantine/core';

import { ThemeOverrides, encodeOverrides } from '../../utils/overrides';
import { TokenField } from '../editor/TokenField';
import { useThemeTokens } from '../editor/useThemeTokens';

type ThemeEditorProps = {
  /** 編集対象のテーマと、その CSS ファイル名 */
  theme: string;
  cssFile: 'timeline' | 'indicator' | 'segment';
  /** ウィジェットのパス (/timeline など)。出力するURLに使う */
  widgetPath: string;
  /** 選択中のアイコンセット。出力するURLに含める */
  iconSet?: string;
  overrides: ThemeOverrides;
  onChange: (overrides: ThemeOverrides) => void;
};

export const ThemeEditor = ({
  theme,
  cssFile,
  widgetPath,
  iconSet,
  overrides,
  onChange,
}: ThemeEditorProps) => {
  const { tokens, loaded } = useThemeTokens(theme, cssFile);

  const setValue = (property: string, value: string | undefined) => {
    const next = { ...overrides };
    if (value === undefined) {
      delete next[property];
    } else {
      next[property] = value;
    }
    onChange(next);
  };

  const url = useMemo(() => {
    const params = new URLSearchParams({ theme });
    if (iconSet) {
      params.set('icons', iconSet);
    }
    const changed = Object.keys(overrides).length > 0;
    if (changed) {
      params.set('v', encodeOverrides(overrides));
    }
    return `${window.location.origin}${widgetPath}?${params.toString()}`;
  }, [theme, iconSet, overrides, widgetPath]);

  const changedCount = Object.keys(overrides).length;

  if (loaded && tokens.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        This theme has no editable tokens in its {cssFile}.css.
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={600}>
          Customize {changedCount > 0 && <Badge size="sm">{changedCount} changed</Badge>}
        </Text>
        <Button size="xs" variant="subtle" disabled={changedCount === 0} onClick={() => onChange({})}>
          Reset all
        </Button>
      </Group>

      <ScrollArea.Autosize mah={360} type="auto">
        <Stack gap="xs" pr="sm">
          {tokens.map((token) => (
            <TokenField
              key={token.property}
              token={token}
              value={overrides[token.property]}
              // テーマを書く人が見る画面なので、CSSの変数名も出す
              showProperty
              onChange={(v) => setValue(token.property, v)}
            />
          ))}
        </Stack>
      </ScrollArea.Autosize>

      <Box>
        <Text size="sm" fw={600} mb={4}>
          Widget URL {url.length > 1800 && <Badge color="yellow" size="xs">{url.length} chars</Badge>}
        </Text>
        <Group gap="xs" align="flex-start" wrap="nowrap">
          <TextInput value={url} readOnly style={{ flex: 1 }} styles={{ input: { fontFamily: 'monospace' } }} />
          <CopyButton value={url}>
            {({ copied, copy }) => (
              <Button onClick={copy} variant={copied ? 'filled' : 'default'}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </CopyButton>
        </Group>
      </Box>
    </Stack>
  );
};
