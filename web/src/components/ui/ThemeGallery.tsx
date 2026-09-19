import React, { useEffect, useRef, useState } from 'react';

import { Box, Text } from '@mantine/core';

import { useThemes } from '../../hooks';

export type WidgetType = 'timeline' | 'indicator' | 'segment';

type ThemeGalleryProps = {
  type: WidgetType;
  theme: string;
  onChangeTheme: (theme: string) => void;
  /** プレビューの背景。ウィジェットは透過なので、下地が無いと何も見えない */
  background: string;
  /** 選択中テーマの実寸。OBS のソースサイズの目安として親に渡す */
  onMeasure?: (size: { width: number; height: number } | undefined) => void;
};

/** プレビュー1枚あたりの描画領域。ウィジェットの実寸に近い比率にしておく */
const FRAME: { [key in WidgetType]: { width: number; height: number } } = {
  timeline: { width: 820, height: 240 },
  indicator: { width: 1280, height: 140 },
  segment: { width: 520, height: 150 },
};

/** 2列に並べる。列が広いぶんプレビューを大きく見せられる */
const COLUMNS = 2;
/** 実際の幅は列幅に合わせて測る。これは測れるまでの初期値 */
const INITIAL_CARD_WIDTH = 360;

/** 選択中テーマの実寸を測りにいく間隔と、諦めるまでの時間 */
const MEASURE_INTERVAL = 300;
const MEASURE_TIMEOUT = 15000;

const ROOT_SELECTOR: { [key in WidgetType]: string } = {
  timeline: '.mcsr-widget',
  indicator: '.mcsr-indicator',
  segment: '.mcsr-segment',
};

/**
 * テーマを1つ描いたカード。
 *
 * テーマCSSはどれも同じクラス名を狙うので、1つの文書に複数読み込むと衝突する。
 * iframe に分けて、それぞれに素のウィジェットページを描かせる。
 * preview=1 は同梱データを使うのでAPIへのポーリングが起きず、デモ警告も出ない。
 */
const ThemeCard = ({
  type,
  name,
  selected,
  background,
  onSelect,
  onMeasure,
}: {
  type: WidgetType;
  name: string;
  selected: boolean;
  background: string;
  onSelect: () => void;
  onMeasure?: (size: { width: number; height: number } | undefined) => void;
}) => {
  const frame = FRAME[type];
  const ref = useRef<HTMLIFrameElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);

  // 列幅は画面幅で変わるので、実測してからプレビューの縮尺を決める
  const [cardWidth, setCardWidth] = useState(INITIAL_CARD_WIDTH);
  useEffect(() => {
    const element = cardRef.current;
    if (!element) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) {
        setCardWidth(width);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scale = cardWidth / frame.width;

  // 選択中のものだけ実寸を測る。同一オリジンなので中を読める
  useEffect(() => {
    if (!selected || !onMeasure) {
      return;
    }
    let cancelled = false;
    const measure = (): boolean => {
      const root = ref.current?.contentDocument?.querySelector(ROOT_SELECTOR[type]);
      if (cancelled || !root) {
        return false;
      }
      /*
       * ルートは幅100%のことがあり、そのまま測ると枠の幅を返してしまう。
       * 実際に描かれている子要素の広がりを見て、中身が収まる大きさを出す。
       */
      const base = root.getBoundingClientRect();
      let right = 0;
      let bottom = 0;
      root.querySelectorAll('*').forEach((child) => {
        const box = (child as HTMLElement).getBoundingClientRect();
        if (box.width > 0 && box.height > 0) {
          right = Math.max(right, box.right - base.left);
          bottom = Math.max(bottom, box.bottom - base.top);
        }
      });
      if (right > 0 && bottom > 0) {
        onMeasure({ width: Math.ceil(right), height: Math.ceil(bottom) });
        return true;
      }
      return false;
    };

    /*
     * 中の描画はデータ取得を待つので、読み込み直後には出ていない。
     * いつ出るかは環境次第なので、出るまで見に行く。1回きりだと
     * 間に合わなかったときにサイズが出ないまま終わってしまう。
     */
    const deadline = Date.now() + MEASURE_TIMEOUT;
    const timer = window.setInterval(() => {
      if (measure() || Date.now() > deadline) {
        window.clearInterval(timer);
      }
    }, MEASURE_INTERVAL);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [selected, type, name, onMeasure]);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      title={name}
      style={{
        display: 'block',
        padding: 0,
        border: selected ? '2px solid var(--mantine-color-blue-6)' : '1px solid var(--mantine-color-gray-4)',
        borderRadius: 8,
        overflow: 'hidden',
        background: 'transparent',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          height: Math.round(frame.height * scale),
          background,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <iframe
          ref={ref}
          title={`${name} preview`}
          src={`/${type}?theme=${encodeURIComponent(name)}&preview=1`}
          scrolling="no"
          style={{
            width: frame.width,
            height: frame.height,
            border: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        />
      </div>
      <Text size="sm" fw={selected ? 700 : 500} ta="center" py={8} truncate>
        {name}
      </Text>
    </button>
  );
};

export const ThemeGallery = ({ type, theme, onChangeTheme, background, onMeasure }: ThemeGalleryProps) => {
  const { data: themes = [] } = useThemes();
  const supported = themes.filter((item) => item[type]);

  if (supported.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        No theme supports this widget.
      </Text>
    );
  }

  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
        gap: 8,
      }}
    >
      {supported.map((item) => (
        <ThemeCard
          key={item.name}
          type={type}
          name={item.name}
          selected={item.name === theme}
          background={background}
          onSelect={() => onChangeTheme(item.name)}
          onMeasure={onMeasure}
        />
      ))}
    </Box>
  );
};

/** 選択中テーマの実寸を保持する。OBS のソースサイズの案内に使う */
export const useMeasuredSize = () => {
  const [size, setSize] = useState<{ width: number; height: number } | undefined>();
  return { size, onMeasure: setSize };
};
