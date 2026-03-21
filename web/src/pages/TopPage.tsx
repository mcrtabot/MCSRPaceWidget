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

import { ThemeSelector, ThemeSelectorCondition } from '../components/ui/ThemeSelector';
import { Indicator } from '../components/widget/Indicator';
import { Timelines } from '../components/widget/Timelines';
import { AppContext } from '../context';
import { usePBTimeline, useSetting, useTimeline } from '../hooks';

export const TopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams({ timeline: 'default', indicator: 'default', data: 'demo' });
  const timelineTheme = searchParams.get('timeline') || 'default';
  const indicatorTheme = searchParams.get('indicator') || 'default';
  const dataType = (searchParams.get('data') || 'demo') as 'demo' | 'actual';

  const [igt, setIGT] = useState(1200);
  const [bgColor, setBgColor] = useState('#333');
  const [activeTab, setActiveTab] = useState<string | null>('timeline');

  const changeTheme = useCallback(
    (type: 'timeline' | 'indicator', theme: string) => {
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
  const { isLoading: isLoadingSetting, setting, hasError: hasErrorSetting } = useSetting(timelineTheme, true);

  if (isLoadingTimeline || isLoadingPBTimeline || isLoadingSetting) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (hasErrorTimeline || !timeline || hasErrorSetting || !setting || hasErrorPBTimeline || !pbTimeline) {
    return (
      <Container size="sm" py="xl">
        {(hasErrorSetting || !setting) && (
          <Alert color="red" title="Error">
            file:theme/{timelineTheme}/setting.json does not exist or is in an invalid data format.
          </Alert>
        )}
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Hero */}
        <div>
          <Group align="baseline" gap="md">
            <Title order={1} style={{ fontFamily: 'Minecraft-Regular, Minecraft, Arial, Helvetica, sans-serif' }}>
              MCSR Pace Widget
            </Title>
            <Badge variant="light" color="gray" size="lg">
              v0.1.0
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
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
            <Tabs.Tab value="indicator">Visual Timeline</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="timeline" pt="md">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
              <div>
                <ThemeSelector
                  type="timeline"
                  theme={timelineTheme}
                  onChangeTheme={(theme: string) => changeTheme('timeline', theme)}
                />
                <Box
                  mt="md"
                  p="md"
                  style={{
                    background: bgColor,
                    borderRadius: 8,
                    minHeight: 240,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <AppContext.Provider value={{ timeline, pbTimeline, theme: timelineTheme, setting }}>
                    <Timelines />
                  </AppContext.Provider>
                </Box>
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
                />
                <Box
                  mt="md"
                  p="md"
                  style={{ background: bgColor, borderRadius: 8, minHeight: 240, overflow: 'hidden' }}
                >
                  <AppContext.Provider value={{ timeline, pbTimeline, theme: indicatorTheme, setting }}>
                    <div style={{ width: '80%', ['--id-width' as any]: '100%' }}>
                      <Indicator />
                    </div>
                  </AppContext.Provider>
                </Box>
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
                <List.Item>Set up your personal best splits from the Settings GUI</List.Item>
                <List.Item>Choose a theme from the preview above</List.Item>
                <List.Item>Copy the widget URL and add it as a Browser Source in OBS</List.Item>
              </List>
              <Alert color="orange" variant="light" mt="md" p="sm">
                <Text size="xs" fw={600}>
                  For real-time updates, set <b>"Auto Save Interval"</b> to <b>"Ticks"</b> in SpeedRunIGT Options &gt;
                  Timer.
                </Text>
              </Alert>
              <Text size="xs" c="dimmed" mt="sm">
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
                You can create your own themes with a little CSS knowledge.
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
