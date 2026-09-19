import React, { useCallback, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Select,
  Slider,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

import { defaultPBTimeline, presets } from '../assets/playground/presets';
import { ThemeEditor } from '../components/playground/ThemeEditor';
import { Indicator } from '../components/widget/Indicator';
import { Segment } from '../components/widget/Segment';
import { Timelines } from '../components/widget/Timelines';
import { AppContext } from '../context';
import { useIconSet, useSetting, useThemeOverrides, useThemes } from '../hooks';
import { defaultSetting } from '../setting';
import { Theme, TimelineData, TimelineItem } from '../types';
import { ThemeOverrides, decodeOverrides, encodeOverrides } from '../utils/overrides';
import { convertMillisecondsToTime, convertTimeToMilliSeconds } from '../utils/utils';

const getNumParam = (params: URLSearchParams, key: string, fallback: number) => {
  const v = params.get(key);
  return v !== null ? Number(v) : fallback;
};

export const PlaygroundPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPresetIndex = Math.min(Math.max(getNumParam(searchParams, 'preset', 0), 0), presets.length - 1);

  const [presetIndex, setPresetIndex] = useState(initialPresetIndex);
  const igtParam = searchParams.get('igt');
  const initialTimeline = presets[initialPresetIndex].timeline;
  const [timeline, setTimeline] = useState<TimelineData>(
    igtParam !== null ? { ...initialTimeline, igt: Number(igtParam) * 1000 } : initialTimeline,
  );
  const [pbItems, setPbItems] = useState<TimelineItem[]>(defaultPBTimeline);
  const [timelineTheme, setTimelineTheme] = useState(searchParams.get('tlTheme') || 'default');
  const [indicatorTheme, setIndicatorTheme] = useState(searchParams.get('vtTheme') || 'default');
  const [segmentTheme, setSegmentTheme] = useState(searchParams.get('sgTheme') || 'default');
  const [tlScale, setTlScale] = useState(getNumParam(searchParams, 'tlScale', 100));
  const [vtScale, setVtScale] = useState(getNumParam(searchParams, 'vtScale', 75));
  const [sgScale, setSgScale] = useState(getNumParam(searchParams, 'sgScale', 100));

  const updateParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          if (value === '') {
            prev.delete(key);
          } else {
            prev.set(key, value);
          }
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const { isLoading: isLoadingSetting, setting } = useSetting(timelineTheme, true);
  const { setting: segmentSetting } = useSetting(segmentTheme, true);
  const { setting: indicatorSetting } = useSetting(indicatorTheme, true);
  const { data: themes = [] } = useThemes();

  const applyPreset = useCallback(
    (index: number) => {
      setPresetIndex(index);
      setTimeline(presets[index].timeline);
      updateParam('preset', String(index));
    },
    [updateParam],
  );

  const changeTimelineTheme = useCallback(
    (v: string) => {
      setTimelineTheme(v);
      updateParam('tlTheme', v);
    },
    [updateParam],
  );
  const changeIndicatorTheme = useCallback(
    (v: string) => {
      setIndicatorTheme(v);
      updateParam('vtTheme', v);
    },
    [updateParam],
  );
  const changeSegmentTheme = useCallback(
    (v: string) => {
      setSegmentTheme(v);
      updateParam('sgTheme', v);
    },
    [updateParam],
  );
  const changeTlScale = useCallback(
    (v: number) => {
      setTlScale(v);
      updateParam('tlScale', String(v));
    },
    [updateParam],
  );
  const changeVtScale = useCallback(
    (v: number) => {
      setVtScale(v);
      updateParam('vtScale', String(v));
    },
    [updateParam],
  );
  const changeSgScale = useCallback(
    (v: number) => {
      setSgScale(v);
      updateParam('sgScale', String(v));
    },
    [updateParam],
  );

  // PB timeline item CRUD
  const updatePbItem = useCallback((i: number, field: 'type' | 'igt', value: string | number) => {
    setPbItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }, []);
  const addPbItem = useCallback(() => setPbItems((prev) => [...prev, { type: '', igt: 0 }]), []);
  const removePbItem = useCallback((i: number) => setPbItems((prev) => prev.filter((_, j) => j !== i)), []);

  // Timeline item CRUD
  const updateTimelineItem = useCallback((i: number, field: 'type' | 'igt', value: string | number) => {
    setTimeline((prev) => {
      const next = [...prev.timelines];
      next[i] = { ...next[i], [field]: value };
      return { ...prev, timelines: next };
    });
  }, []);
  const addTimelineItem = useCallback(() => {
    setTimeline((prev) => ({ ...prev, timelines: [...prev.timelines, { type: '', igt: 0 }] }));
  }, []);
  const removeTimelineItem = useCallback((i: number) => {
    setTimeline((prev) => ({ ...prev, timelines: prev.timelines.filter((_, j) => j !== i) }));
  }, []);

  // Filter timeline items by IGT
  const filteredTimeline: TimelineData = useMemo(
    () => ({
      igt: timeline.igt,
      timelines:
        timeline.igt !== null ? timeline.timelines.filter((item) => item.igt <= timeline.igt!) : timeline.timelines,
    }),
    [timeline],
  );

  const timelineThemeOptions = useMemo(
    () => themes.filter((t: Theme) => t.timeline).map((t: Theme) => ({ value: t.name, label: t.name })),
    [themes],
  );
  const indicatorThemeOptions = useMemo(
    () => themes.filter((t: Theme) => t.indicator).map((t: Theme) => ({ value: t.name, label: t.name })),
    [themes],
  );
  const segmentThemeOptions = useMemo(
    () => themes.filter((t: Theme) => t.segment).map((t: Theme) => ({ value: t.name, label: t.name })),
    [themes],
  );

  const igtMax = useMemo(() => {
    const allIgts = [...pbItems, ...timeline.timelines].map((item) => item.igt);
    const maxIgt = allIgts.length > 0 ? Math.max(...allIgts) : 0;
    return Math.ceil((maxIgt * 1.25) / 60000) * 60;
  }, [pbItems, timeline.timelines]);

  const igtMarks = useMemo(
    () =>
      timeline.timelines.map((item) => ({
        value: item.igt / 1000,
        label: item.type
          .replace(/^enter_/, '')
          .replace('first_portal', 'portal')
          .replace('credits', 'finish'),
      })),
    [timeline.timelines],
  );

  const resolvedSetting = setting ?? defaultSetting;
  const resolvedSegmentSetting = segmentSetting ?? defaultSetting;

  // アイコンセットはタブごとに選んでいるテーマの設定から引く
  // 編集中のトークン差分。タブごとに持ち、URLに載せてリロードでも戻るようにする
  const activeTab = searchParams.get('tab') || 'timeline';
  const overridesParam = { timeline: 'tlV', 'visual-timeline': 'vtV', segment: 'sgV' }[activeTab] ?? 'tlV';
  const overrides = useMemo(() => decodeOverrides(searchParams.get(overridesParam)), [searchParams, overridesParam]);
  const setOverrides = useCallback(
    (next: ThemeOverrides) => updateParam(overridesParam, Object.keys(next).length ? encodeOverrides(next) : ''),
    [overridesParam, updateParam],
  );
  // 表示中のタブのぶんだけ効かせる。タブ間で同じ変数名を使うテーマがあるため
  useThemeOverrides(overrides);

  const { iconSet: timelineIconSet, isLoading: isLoadingTimelineIconSet } = useIconSet(resolvedSetting.iconSet);
  const { iconSet: indicatorIconSet, isLoading: isLoadingIndicatorIconSet } = useIconSet(indicatorSetting?.iconSet);
  const { iconSet: segmentIconSet, isLoading: isLoadingSegmentIconSet } = useIconSet(resolvedSegmentSetting.iconSet);

  if (isLoadingSetting || isLoadingTimelineIconSet || isLoadingIndicatorIconSet || isLoadingSegmentIconSet) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="md" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Title order={2} mb="md">
        Playground
      </Title>

      {/* Common Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Stack gap="sm">
          <Group align="flex-end" gap="sm">
            <Select
              label="Preset"
              value={String(presetIndex)}
              onChange={(val) => val !== null && applyPreset(Number(val))}
              data={presets.map((p, i) => ({ value: String(i), label: p.name }))}
              w={220}
            />
            <Text size="xs" c="dimmed" pb={6} style={{ flex: 1 }}>
              {presets[presetIndex].description}
            </Text>
          </Group>
          <div>
            <Group gap="sm" mb={4}>
              <Text size="sm" fw={600}>
                IGT:
              </Text>
              <Text size="sm">
                {timeline.igt !== null ? (convertMillisecondsToTime(timeline.igt) ?? '0:00') : 'null'}
              </Text>
            </Group>
            <Slider
              value={timeline.igt !== null ? timeline.igt / 1000 : 0}
              onChange={(val) => {
                setTimeline((prev) => ({ ...prev, igt: val * 1000 }));
                updateParam('igt', String(val));
              }}
              min={0}
              max={igtMax}
              step={1}
              marks={igtMarks}
              mb={50}
              styles={{
                markLabel: {
                  transform: 'translateX(12px) rotate(30deg)',
                  transformOrigin: 'top left',
                  whiteSpace: 'nowrap',
                  fontSize: 16,
                },
              }}
            />
          </div>
        </Stack>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ItemEditor
            title="PB Timeline Items"
            items={pbItems}
            onUpdate={updatePbItem}
            onAdd={addPbItem}
            onRemove={removePbItem}
          />
          <ItemEditor
            title="Timeline Items"
            items={timeline.timelines}
            onUpdate={updateTimelineItem}
            onAdd={addTimelineItem}
            onRemove={removeTimelineItem}
          />
        </div>
      </div>

      <Divider my="md" />

      {/* Tabs: Timeline / Visual Timeline */}
      <Tabs
        value={searchParams.get('tab') || 'timeline'}
        onChange={(val) => val && updateParam('tab', val)}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Tabs.List>
          <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
          <Tabs.Tab value="visual-timeline">Visual Timeline</Tabs.Tab>
          <Tabs.Tab value="segment">Segment</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="timeline" pt="md" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Group align="flex-end" gap="md" mb="xl">
            <Select
              label="Theme"
              value={timelineTheme}
              onChange={(val) => val && changeTimelineTheme(val)}
              data={timelineThemeOptions}
              w={200}
            />
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={600} mb={4}>
                Scale: {tlScale}%
              </Text>
              <Slider
                value={tlScale}
                onChange={setTlScale}
                onChangeEnd={changeTlScale}
                min={10}
                max={100}
                step={5}
                marks={[
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' },
                ]}
              />
            </div>
          </Group>
          <Box
            p="md"
            style={{
              flex: 1,
              background: '#333',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <AppContext.Provider
              value={{
                timeline: filteredTimeline,
                pbTimeline: pbItems,
                theme: timelineTheme,
                setting: resolvedSetting,
                iconSet: timelineIconSet,
              }}
            >
              <div style={{ transformOrigin: 'top left', transform: `scale(${tlScale / 100})` }}>
                <div style={{ position: 'relative' }}>
                  <Timelines />
                </div>
              </div>
            </AppContext.Provider>
          </Box>
          <Box mt="md">
            <ThemeEditor
              theme={timelineTheme}
              cssFile="timeline"
              widgetPath="/timeline"
              iconSet={resolvedSetting.iconSet}
              overrides={overrides}
              onChange={setOverrides}
            />
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="visual-timeline" pt="md" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Group align="flex-end" gap="md" mb="xl">
            <Select
              label="Theme"
              value={indicatorTheme}
              onChange={(val) => val && changeIndicatorTheme(val)}
              data={indicatorThemeOptions}
              w={200}
            />
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={600} mb={4}>
                Scale: {vtScale}%
              </Text>
              <Slider
                value={vtScale}
                onChange={setVtScale}
                onChangeEnd={changeVtScale}
                min={10}
                max={100}
                step={5}
                marks={[
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' },
                ]}
              />
            </div>
          </Group>
          <Box
            p="md"
            style={{
              flex: 1,
              background: '#333',
              borderRadius: 8,
              minHeight: 80,
              overflow: 'auto',
            }}
          >
            <AppContext.Provider
              value={{
                timeline: filteredTimeline,
                pbTimeline: pbItems,
                theme: indicatorTheme,
                setting: resolvedSetting,
                iconSet: indicatorIconSet,
              }}
            >
              <div style={{ transformOrigin: 'top left', transform: `scale(${vtScale / 100})` }}>
                <Indicator />
              </div>
            </AppContext.Provider>
          </Box>
          <Box mt="md">
            <ThemeEditor
              theme={indicatorTheme}
              cssFile="indicator"
              widgetPath="/indicator"
              iconSet={indicatorSetting?.iconSet}
              overrides={overrides}
              onChange={setOverrides}
            />
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="segment" pt="md" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Group align="flex-end" gap="md" mb="xl">
            <Select
              label="Theme"
              value={segmentTheme}
              onChange={(val) => val && changeSegmentTheme(val)}
              data={segmentThemeOptions}
              w={200}
            />
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={600} mb={4}>
                Scale: {sgScale}%
              </Text>
              <Slider
                value={sgScale}
                onChange={setSgScale}
                onChangeEnd={changeSgScale}
                min={10}
                max={100}
                step={5}
                marks={[
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' },
                ]}
              />
            </div>
          </Group>
          <Box
            p="md"
            style={{
              flex: 1,
              background: '#333',
              borderRadius: 8,
              minHeight: 80,
              overflow: 'auto',
            }}
          >
            <AppContext.Provider
              value={{
                timeline: filteredTimeline,
                pbTimeline: pbItems,
                theme: segmentTheme,
                setting: resolvedSegmentSetting,
                iconSet: segmentIconSet,
              }}
            >
              <div style={{ transformOrigin: 'top left', transform: `scale(${sgScale / 100})` }}>
                <Segment />
              </div>
            </AppContext.Provider>
          </Box>
          <Box mt="md">
            <ThemeEditor
              theme={segmentTheme}
              cssFile="segment"
              widgetPath="/segment"
              iconSet={resolvedSegmentSetting.iconSet}
              overrides={overrides}
              onChange={setOverrides}
            />
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

const ItemEditor = ({
  title,
  items,
  onUpdate,
  onAdd,
  onRemove,
}: {
  title: string;
  items: TimelineItem[];
  onUpdate: (index: number, field: 'type' | 'igt', value: string | number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) => (
  <div>
    <Group justify="space-between" mb="xs">
      <Text size="sm" fw={600}>
        {title}
      </Text>
      <Button size="compact-xs" variant="light" onClick={onAdd}>
        + Add
      </Button>
    </Group>
    <Table fz="xs" verticalSpacing={4}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Type</Table.Th>
          <Table.Th>IGT</Table.Th>
          <Table.Th w={32} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((item, i) => (
          <TimelineItemRow key={i} item={item} index={i} onUpdate={onUpdate} onRemove={onRemove} />
        ))}
      </Table.Tbody>
    </Table>
  </div>
);

const TimelineItemRow = ({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: TimelineItem;
  index: number;
  onUpdate: (index: number, field: 'type' | 'igt', value: string | number) => void;
  onRemove: (index: number) => void;
}) => {
  const igtDisplay = convertMillisecondsToTime(item.igt);

  return (
    <Table.Tr>
      <Table.Td>
        <TextInput
          size="xs"
          value={item.type}
          onChange={(e) => onUpdate(index, 'type', e.currentTarget.value)}
          styles={{ input: { fontFamily: 'monospace', fontSize: 11 } }}
        />
      </Table.Td>
      <Table.Td>
        <TextInput
          size="xs"
          value={igtDisplay}
          onChange={(e) => {
            const ms = convertTimeToMilliSeconds(e.currentTarget.value);
            if (ms !== undefined) {
              onUpdate(index, 'igt', ms);
            }
          }}
          placeholder="MM:SS.mmm"
          styles={{ input: { fontFamily: 'monospace', fontSize: 11 } }}
        />
      </Table.Td>
      <Table.Td>
        <Button size="compact-xs" variant="subtle" color="red" onClick={() => onRemove(index)}>
          ×
        </Button>
      </Table.Td>
    </Table.Tr>
  );
};
