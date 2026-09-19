import React, { useEffect, useMemo, useState } from 'react';

import { Button, CopyButton, Group, Select, Slider, Switch, TextInput } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

import { defaultPBTimeline, presets } from '../assets/playground/presets';
import { TokenField, isAdvancedToken } from '../components/editor/TokenField';
import { useThemeTokens } from '../components/editor/useThemeTokens';
import { Indicator } from '../components/widget/Indicator';
import { Segment } from '../components/widget/Segment';
import { Timelines } from '../components/widget/Timelines';
import { AppContext } from '../context';
import { useIconSet, useIconSets, useSetting, useThemeOverrides, useThemes } from '../hooks';
import { defaultSetting } from '../setting';
import { TokenType } from '../utils/cssTokens';
import { ThemeOverrides, decodeOverrides, encodeOverrides } from '../utils/overrides';
import './customize.css';

type WidgetId = 'timeline' | 'indicator' | 'segment';

const WIDGETS: { id: WidgetId; label: string; cssFile: 'timeline' | 'indicator' | 'segment' }[] = [
  { id: 'timeline', label: 'Timeline', cssFile: 'timeline' },
  { id: 'indicator', label: 'Visual Timeline', cssFile: 'indicator' },
  { id: 'segment', label: 'Segment', cssFile: 'segment' },
];

/** トークンの型をそのままグループにする。パーサが型を持っているので追加の定義が要らない */
const GROUPS: { label: string; types: TokenType[] }[] = [
  { label: 'Colors', types: ['color'] },
  { label: 'Text', types: ['text'] },
  { label: 'Sizes', types: ['length'] },
  { label: 'Images', types: ['image'] },
  { label: 'Show & Hide', types: ['toggle'] },
];

/**
 * 差分はウィジェットごとに別のパラメータで持つ。1つにまとめると、
 * Timeline を編集したあと Visual Timeline に切り替えたときに
 * --tl-* が indicator のURLに紛れ込む。
 * timeline だけ `v` なのは、ウィジェットURLをそのまま貼り付けても読めるようにするため。
 */
const OVERRIDE_PARAM: { [key in WidgetId]: string } = {
  timeline: 'v',
  indicator: 'vi',
  segment: 'vs',
};

const STAGE_PRESETS = ['#2b2f36', '#0f1114', '#5a8f3c', '#f4f5f7'];

const TokenGroup = ({
  label,
  count,
  changed,
  defaultOpen,
  children,
}: {
  label: string;
  count: number;
  changed: number;
  defaultOpen: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="editor__group" data-open={open}>
      <button type="button" className="editor__group-head" onClick={() => setOpen((v) => !v)}>
        <i className="editor__chevron" />
        <span className="editor__group-name">{label}</span>
        <span className="editor__group-count">{count}</span>
        {changed > 0 && <span className="editor__group-changed">{changed}</span>}
      </button>
      {open && <div className="editor__group-body">{children}</div>}
    </section>
  );
};

export const CustomizePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const widget = (searchParams.get('w') as WidgetId) || 'timeline';
  const theme = searchParams.get('theme') || 'default';
  const iconsParam = searchParams.get('icons') || undefined;
  const overrideParam = OVERRIDE_PARAM[widget] ?? 'v';
  const overrides = useMemo(() => decodeOverrides(searchParams.get(overrideParam)), [searchParams, overrideParam]);

  const [presetIndex, setPresetIndex] = useState(0);
  // 走行中の途中経過を見たいので、IGT を動かせるようにする。null は「プリセットのまま」
  const [igtSeconds, setIgtSeconds] = useState<number | null>(null);
  const [scale, setScale] = useState(100);
  const [stage, setStage] = useState(STAGE_PRESETS[0]);
  const [showProperty, setShowProperty] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const setParam = (key: string, value: string) =>
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

  const setOverrides = (next: ThemeOverrides) =>
    setParam(overrideParam, Object.keys(next).length ? encodeOverrides(next) : '');

  const { data: themes } = useThemes();
  const { data: iconSets } = useIconSets();
  const { isLoading: isLoadingSetting, setting } = useSetting(theme, true);
  const resolvedSetting = setting ?? defaultSetting;
  const iconSetId = iconsParam ?? resolvedSetting.iconSet;
  // 読み込み完了までプレビューを出さない。出すとセット解決前に
  // テーマ同梱のパスを叩いてしまい、アイコンが一瞬欠ける
  const { iconSet, isLoading: isLoadingIconSet } = useIconSet(iconSetId);

  const widgetDef = WIDGETS.find((w) => w.id === widget) ?? WIDGETS[0];
  const tokens = useThemeTokens(theme, widgetDef.cssFile);

  useThemeOverrides(overrides);

  // その種別の CSS を持つテーマだけ選ばせる。無いテーマを選んでも何も描かれない
  const themesForWidget = useMemo(
    () => (themes ?? []).filter((t) => (widget === 'timeline' ? t.timeline : widget === 'indicator' ? t.indicator : t.segment)),
    [themes, widget],
  );

  // 選んだテーマが対応しているウィジェットだけ出す
  const supported = useMemo(() => {
    const found = themes?.find((t) => t.name === theme);
    return WIDGETS.filter((w) => {
      if (!found) {
        return true;
      }
      return w.id === 'timeline' ? found.timeline : w.id === 'indicator' ? found.indicator : found.segment;
    });
  }, [themes, theme]);

  /*
   * テーマを変えた結果、今開いている種別に対応しなくなることがある
   * (Segment だけのテーマへ切り替えた場合など)。対応する種別へ移しておかないと
   * 何も描かれない画面のままになる。
   */
  useEffect(() => {
    if (supported.length > 0 && !supported.some((w) => w.id === widget)) {
      setParam('w', supported[0].id);
    }
  });

  const preset = presets[presetIndex] ?? presets[0];

  // スライダーの上限は PB とプリセットの両方が収まる長さにする
  const igtMax = useMemo(() => {
    const all = [...defaultPBTimeline, ...preset.timeline.timelines].map((item) => item.igt);
    return Math.ceil((Math.max(0, ...all) * 1.25) / 60000) * 60;
  }, [preset]);

  const igt = igtSeconds !== null ? igtSeconds * 1000 : (preset.timeline.igt ?? 0);

  // IGT より後のスプリットはまだ起きていないものとして落とす
  const timeline = useMemo(
    () => ({ igt, timelines: preset.timeline.timelines.filter((item) => item.igt <= igt) }),
    [preset, igt],
  );

  /*
   * スプリットの位置に目盛りを置く。ツールバーが細く、ラベルを出すと
   * 名前どうしが重なって読めないので、位置だけ示してタイムはつまみに出す。
   */
  const igtMarks = useMemo(
    () => preset.timeline.timelines.map((item) => ({ value: item.igt / 1000 })),
    [preset],
  );

  const url = useMemo(() => {
    const params = new URLSearchParams({ theme });
    if (iconsParam) {
      params.set('icons', iconsParam);
    }
    if (Object.keys(overrides).length > 0) {
      params.set('v', encodeOverrides(overrides));
    }
    return `${window.location.origin}/${widget === 'indicator' ? 'indicator' : widget}?${params.toString()}`;
  }, [theme, iconsParam, overrides, widget]);

  const changedCount = Object.keys(overrides).length;

  const context = {
    timeline,
    pbTimeline: defaultPBTimeline,
    theme,
    setting: resolvedSetting,
    iconSet,
  };

  return (
    <div className="editor">
      <header className="editor__header">
        <div className="editor__title">
          Theme Editor<span>{theme}</span>
        </div>
        <div className="editor__widgets" role="tablist">
          {supported.map((w) => (
            <button
              key={w.id}
              type="button"
              role="tab"
              aria-selected={w.id === widget}
              className="editor__widget"
              onClick={() => setParam('w', w.id)}
            >
              {w.label}
            </button>
          ))}
        </div>
        <div className="editor__header-spacer" />
        <Button component="a" href="/" variant="subtle" size="compact-sm">
          Back
        </Button>
      </header>

      <div className="editor__body">
        <div className="editor__preview">
          <div className="editor__stage" style={{ background: stage }}>
            <div className="editor__stage-inner" style={{ transform: `scale(${scale / 100})` }}>
              {!isLoadingSetting && !isLoadingIconSet && (
                <AppContext.Provider value={context}>
                  {widget === 'timeline' && <Timelines />}
                  {widget === 'indicator' && <Indicator />}
                  {widget === 'segment' && <Segment />}
                </AppContext.Provider>
              )}
            </div>
          </div>

          <div className="editor__preview-bar">
            <label className="editor__field-inline">
              Pace
              <Select
                size="xs"
                w={150}
                value={String(presetIndex)}
                onChange={(v) => {
                  setPresetIndex(Number(v ?? 0));
                  setIgtSeconds(null);
                }}
                data={presets.map((p, i) => ({ value: String(i), label: p.name }))}
                allowDeselect={false}
              />
            </label>
            <label className="editor__field-inline">
              Background
              {STAGE_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  onClick={() => setStage(c)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    background: c,
                    border: c === stage ? '2px solid var(--e-accent)' : '1px solid var(--e-border-strong)',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </label>
            <label className="editor__field-inline" style={{ flex: 2, minWidth: 260 }}>
              IGT
              <Slider
                style={{ flex: 1 }}
                size="sm"
                value={Math.round(igt / 1000)}
                onChange={setIgtSeconds}
                min={0}
                max={igtMax}
                step={1}
                marks={igtMarks}
                label={(v) => `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`}
              />
            </label>
            <label className="editor__field-inline" style={{ flex: 1, maxWidth: 200 }}>
              Zoom
              <Slider
                style={{ flex: 1 }}
                size="sm"
                value={scale}
                onChange={setScale}
                min={25}
                max={150}
                step={5}
                label={(v) => `${v}%`}
              />
            </label>
          </div>
        </div>

        <aside className="editor__panel">
          <div className="editor__panel-head">
            <Select
              size="xs"
              label="Theme"
              value={theme}
              onChange={(v) => v && setParam('theme', v)}
              data={themesForWidget.map((t) => ({ value: t.name, label: t.name }))}
              allowDeselect={false}
            />
            <Select
              size="xs"
              label="Icons"
              value={iconSetId ?? ''}
              onChange={(v) => setParam('icons', v ?? '')}
              data={(iconSets ?? []).map((s) => ({ value: s.id, label: s.name }))}
              allowDeselect={false}
            />
          </div>

          <div className="editor__panel-body">
            {tokens.length === 0 ? (
              <p className="editor__empty">This theme has nothing to adjust for {widgetDef.label}.</p>
            ) : (
              GROUPS.map((group, i) => {
                const items = tokens.filter(
                  (t) => group.types.includes(t.type) && (showAdvanced || !isAdvancedToken(t)),
                );
                if (items.length === 0) {
                  return null;
                }
                const changed = items.filter((t) => overrides[t.property] !== undefined).length;
                return (
                  <TokenGroup
                    key={group.label}
                    label={group.label}
                    count={items.length}
                    changed={changed}
                    defaultOpen={i === 0}
                  >
                    {items.map((token) => (
                      <TokenField
                        key={token.property}
                        token={token}
                        value={overrides[token.property]}
                        showProperty={showProperty}
                        onChange={(value) => {
                          const next = { ...overrides };
                          if (value === undefined) {
                            delete next[token.property];
                          } else {
                            next[token.property] = value;
                          }
                          setOverrides(next);
                        }}
                      />
                    ))}
                  </TokenGroup>
                );
              })
            )}
          </div>

          <div className="editor__panel-foot">
            <TextInput
              size="xs"
              label="Widget URL for OBS"
              value={url}
              readOnly
              classNames={{ input: 'editor__url' }}
              rightSectionWidth={64}
              rightSection={
                <CopyButton value={url}>
                  {({ copied, copy }) => (
                    <Button size="compact-xs" variant={copied ? 'filled' : 'light'} onClick={copy}>
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  )}
                </CopyButton>
              }
            />
            <div className="editor__field-inline" style={{ justifyContent: 'space-between' }}>
              <Group gap="md">
                <Switch
                  size="xs"
                  label="Advanced"
                  checked={showAdvanced}
                  onChange={(e) => setShowAdvanced(e.currentTarget.checked)}
                />
                <Switch
                  size="xs"
                  label="CSS names"
                  checked={showProperty}
                  onChange={(e) => setShowProperty(e.currentTarget.checked)}
                />
              </Group>
              <Button
                size="compact-xs"
                variant="subtle"
                disabled={changedCount === 0}
                onClick={() => setOverrides({})}
              >
                Reset all ({changedCount})
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
