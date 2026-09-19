import React, { useCallback, useState } from 'react';

import {
  Accordion,
  Alert,
  Anchor,
  Badge,
  Box,
  Card,
  Center,
  Container,
  Divider,
  Group,
  List,
  Loader,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

import { EnvironmentWarning } from '../components/ui/EnvironmentWarning';
import { ThemeSelector, ThemeSelectorCondition } from '../components/ui/ThemeSelector';
import { Indicator } from '../components/widget/Indicator';
import { Segment } from '../components/widget/Segment';
import { Timelines } from '../components/widget/Timelines';
import { AppContext } from '../context';
import { useIconSet, usePBTimeline, useSetting, useTimeline } from '../hooks';

export const TopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams({ timeline: 'default', indicator: 'default', segment: 'default', data: 'demo' });
  const timelineTheme = searchParams.get('timeline') || 'default';
  const indicatorTheme = searchParams.get('indicator') || 'default';
  const segmentTheme = searchParams.get('segment') || 'default';
  const dataType = (searchParams.get('data') || 'demo') as 'demo' | 'actual';

  const [igt, setIGT] = useState(1200);
  const [bgColor, setBgColor] = useState('#333');
  const [activeTab, setActiveTab] = useState<string | null>('timeline');

  const changeTheme = useCallback(
    (type: 'timeline' | 'indicator' | 'segment', theme: string) => {
      setSearchParams((prev) => {
        prev.set(type, theme);
        return prev;
      });
    },
    [setSearchParams],
  );

  const changeIGT = useCallback((igt: number) => {
    setIGT(igt);
  }, []);

  const changeDataType = useCallback(
    (dataType: 'demo' | 'actual') => {
      setSearchParams((prev) => {
        prev.set('data', dataType);
        return prev;
      });
    },
    [setSearchParams],
  );

  const {
    isLoading: isLoadingTimeline,
    data: timeline,
    hasError: hasErrorTimeline,
  } = useTimeline(dataType === 'demo', igt);
  const {
    isLoading: isLoadingPBTimeline,
    data: pbTimeline,
    hasError: hasErrorPBTimeline,
  } = usePBTimeline(dataType === 'demo');
  // タブごとに別のテーマを選べるので、3つとも読む。
  // 直しながら見る画面ではないので取り直しは通常の間隔でよい
  const { isLoading: isLoadingSetting, setting, hasError: hasErrorSetting } = useSetting(timelineTheme, false);
  const { isLoading: isLoadingSegmentSetting, setting: segmentSetting } = useSetting(segmentTheme, false);
  const { isLoading: isLoadingIndicatorSetting, setting: indicatorSetting } = useSetting(indicatorTheme, false);

  // アイコンはテーマ同梱ではなく共通セットから来るので、プレビューにも渡す。
  // 読み込みを待たずに描くと、解決前にテーマ同梱のパスを叩いて404になる。
  // セットidは setting.json に書いてあるので、setting の読み込みも待つ
  const { iconSet: timelineIconSet, isLoading: isLoadingTimelineIcons } = useIconSet(setting?.iconSet);
  const { iconSet: indicatorIconSet, isLoading: isLoadingIndicatorIcons } = useIconSet(indicatorSetting?.iconSet);
  const { iconSet: segmentIconSet, isLoading: isLoadingSegmentIcons } = useIconSet(segmentSetting?.iconSet);

  if (
    isLoadingTimeline ||
    isLoadingPBTimeline ||
    isLoadingSetting ||
    isLoadingSegmentSetting ||
    isLoadingIndicatorSetting ||
    isLoadingTimelineIcons ||
    isLoadingIndicatorIcons ||
    isLoadingSegmentIcons
  ) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  // テーマが読めないと何も描けない。PB は任意なので、読めなくても続ける
  if (hasErrorTimeline || !timeline || hasErrorSetting || !setting) {
    return (
      <Container size="sm" py="xl">
        <Alert color="red" title="Error">
          {hasErrorSetting || !setting
            ? `file:theme/${timelineTheme}/setting.json does not exist or is in an invalid data format.`
            : 'Failed to load the timeline. Check that the widget server is running.'}
        </Alert>
      </Container>
    );
  }

  return (
    /*
     * この画面は既定の 12〜14px だと小さいので、ここだけ一段上げる。
     *
     * MantineThemeProvider では変わらない。Mantine のコンポーネントは
     * size="sm" などを CSS変数 (--mantine-font-size-sm) で引いており、
     * その変数を出すのはルートの MantineProvider だけのため。
     * 変数は継承するので、この階層で上書きすればこの画面にだけ効く。
     */
    <Container
      size="xl"
      py="xl"
      style={
        {
          '--mantine-font-size-xs': '0.875rem',
          '--mantine-font-size-sm': '1rem',
          '--mantine-font-size-md': '1.125rem',
          '--mantine-font-size-lg': '1.25rem',
          '--mantine-font-size-xl': '1.5rem',
        } as React.CSSProperties
      }
    >
      <Stack gap="xl">
        {/* Hero */}
        <div>
          <Group align="baseline" gap="md">
            <Title order={1} style={{ fontFamily: 'Minecraft-Regular, Minecraft, Arial, Helvetica, sans-serif' }}>
              MCSR Pace Widget
            </Title>
            <Badge variant="light" color="gray" size="lg">
              v3.2.2
            </Badge>
          </Group>
          <Group mt="xs" gap="md">
            <Text c="dimmed">
              A customizable pace tracker widget for Minecraft Speedruns. Preview themes below and copy the URL for OBS.
            </Text>
            <Anchor href="https://github.com/mcrtabot/MCSRPaceWidget" target="_blank" size="sm">
              GitHub
            </Anchor>
          </Group>
        </div>

        <Divider />

        {/* Widget Preview */}
        <EnvironmentWarning />
        {hasErrorPBTimeline && (
          <Alert color="yellow" title="Personal best not loaded">
            file:setting/pb.json does not exist or is in an invalid data format. The preview runs without a personal
            best.
          </Alert>
        )}
        {/* 表示中のタブだけ中身を持つ。各カードが iframe なので、3タブ分を
            同時に抱えると 23 個のウィジェットを常時描くことになる */}
        <Tabs value={activeTab} onChange={setActiveTab} keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
            <Tabs.Tab value="indicator">Visual Timeline</Tabs.Tab>
            <Tabs.Tab value="segment">Segment</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="timeline" pt="md">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
              <div>
                <ThemeSelector
                  type="timeline"
                  theme={timelineTheme}
                  onChangeTheme={(theme: string) => changeTheme('timeline', theme)}
                  background={bgColor}
                >
                  <Box
                    p="md"
                    style={{
                      background: bgColor,
                      borderRadius: 8,
                      minHeight: 200,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <AppContext.Provider value={{ timeline, pbTimeline, theme: timelineTheme, setting, iconSet: timelineIconSet }}>
                      <Timelines />
                    </AppContext.Provider>
                  </Box>
                </ThemeSelector>
              </div>
              <Card withBorder shadow="sm" radius="md" padding="md" w={280}>
                <Title order={5} mb="sm">
                  Preview Options
                </Title>
                <ThemeSelectorCondition
                  igt={igt}
                  onChangeIGT={changeIGT}
                  bgColor={bgColor}
                  onChangeBgColor={setBgColor}
                  dataType={dataType}
                  onChangeDataType={changeDataType}
                />
              </Card>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="indicator" pt="md">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
              <div>
                <ThemeSelector
                  type="indicator"
                  theme={indicatorTheme}
                  onChangeTheme={(theme: string) => changeTheme('indicator', theme)}
                  background={bgColor}
                >
                  <Box
                    p="md"
                    style={{ background: bgColor, borderRadius: 8, minHeight: 200, overflow: 'hidden' }}
                  >
                    <AppContext.Provider
                      value={{ timeline, pbTimeline, theme: indicatorTheme, setting: indicatorSetting ?? setting, iconSet: indicatorIconSet }}
                    >
                      <div style={{ width: '80%', ['--id-width' as any]: '100%' }}>
                        <Indicator />
                      </div>
                    </AppContext.Provider>
                  </Box>
                </ThemeSelector>
              </div>
              <Card withBorder shadow="sm" radius="md" padding="md" w={280}>
                <Title order={5} mb="sm">
                  Preview Options
                </Title>
                <ThemeSelectorCondition
                  igt={igt}
                  onChangeIGT={changeIGT}
                  bgColor={bgColor}
                  onChangeBgColor={setBgColor}
                  dataType={dataType}
                  onChangeDataType={changeDataType}
                />
              </Card>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="segment" pt="md">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
              <div>
                <ThemeSelector
                  type="segment"
                  theme={segmentTheme}
                  onChangeTheme={(theme: string) => changeTheme('segment', theme)}
                  background={bgColor}
                >
                  <Box
                    p="md"
                    style={{ background: bgColor, borderRadius: 8, minHeight: 200, overflow: 'hidden' }}
                  >
                    <AppContext.Provider value={{ timeline, pbTimeline, theme: segmentTheme, setting: segmentSetting ?? setting, iconSet: segmentIconSet }}>
                      <Segment />
                    </AppContext.Provider>
                  </Box>
                </ThemeSelector>
              </div>
              <Card withBorder shadow="sm" radius="md" padding="md" w={280}>
                <Title order={5} mb="sm">
                  Preview Options
                </Title>
                <ThemeSelectorCondition
                  igt={igt}
                  onChangeIGT={changeIGT}
                  bgColor={bgColor}
                  onChangeBgColor={setBgColor}
                  dataType={dataType}
                  onChangeDataType={changeDataType}
                />
              </Card>
            </div>
          </Tabs.Panel>
        </Tabs>

        <Divider />

        {/* Guide */}
        <Accordion variant="separated" radius="md">
          <Accordion.Item value="setup">
            <Accordion.Control>
              <Title order={4}>Getting Started</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <List type="ordered" spacing="xs" size="sm">
                <List.Item>Choose a theme from the preview above</List.Item>
                <List.Item>Copy the widget URL and add it as a Browser Source in OBS</List.Item>
              </List>
              <Text size="sm" c="dimmed" mt="sm">
                That is all you need. The widgets work without a personal best — set your PB splits from the Settings
                GUI when you want to see the difference from it.
              </Text>
              <Text size="sm" c="dimmed" mt="sm">
                Tip: A Minecraft font is bundled. Use <Code>font-family: 'Minecraft-Regular'</Code> in your theme CSS
                for a more authentic look.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="customize">
            <Accordion.Control>
              <Title order={4}>Customizing Themes</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" mb="xs">
                <strong>Adjust an existing theme</strong> — colors, fonts, sizes and which parts are shown, without
                touching any files. Press <strong>Customize...</strong> next to the theme above, or open the{' '}
                <Anchor href="/customize">Theme Editor</Anchor>. It gives you a widget URL that carries your changes,
                so you only have to paste that into OBS.
              </Text>
              <Text size="sm" mt="md" mb="xs">
                <strong>Build a theme from scratch</strong> — this part needs CSS.
              </Text>
              <List type="ordered" spacing="xs" size="sm">
                <List.Item>
                  Duplicate an existing theme folder (e.g. <Code>theme/default</Code>) and rename it
                </List.Item>
                <List.Item>
                  Edit <Code>setting.json</Code> and the stylesheets (<Code>timeline.css</Code> /{' '}
                  <Code>indicator.css</Code>)
                </List.Item>
                <List.Item>
                  Use the <Anchor href="/playground">Playground</Anchor> to test your theme with various data patterns
                  and preview scales
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Container>
  );
};

const Code = ({ children }: { children: React.ReactNode }) => (
  <Text
    component="code"
    size="sm"
    c="blue"
    fw={600}
    style={{ background: 'var(--mantine-color-blue-light)', padding: '1px 6px', borderRadius: 4 }}
  >
    {children}
  </Text>
);
