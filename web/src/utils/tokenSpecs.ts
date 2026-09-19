/**
 * トークンの用語辞書。
 *
 * テーマCSSの `:root` から読める情報は「変数名・値・型」までで、
 * 何を意味する値なのかは分からない。`--id-pb-icon-offset` を
 * 「Id Pb Icon Offset」と出しても読めないので、名前・説明・入力方法を
 * ここで与える。
 *
 * 同梱テーマの変数名は全テーマで共通なので、この1つの表で全部まかなえる。
 * ここに無い変数（自作テーマが独自に足したもの）は、CSSのコメントか
 * 変数名からの機械生成にフォールバックする。
 */

export type TokenInput = 'slider' | 'duration' | 'font';

export type TokenSpec = {
  label: string;
  hint?: string;
  input?: TokenInput;
  min?: number;
  max?: number;
  step?: number;
  /** 既定では隠し、「詳細」を開いたときだけ出す */
  advanced?: boolean;
};

const size = (label: string, hint?: string, advanced?: boolean): TokenSpec => ({
  label,
  hint,
  input: 'slider',
  min: 0,
  max: 128,
  step: 1,
  advanced,
});

const width = (label: string, hint?: string, advanced?: boolean): TokenSpec => ({
  label,
  hint,
  input: 'slider',
  min: 0,
  max: 2000,
  step: 10,
  advanced,
});

const offset = (label: string, hint?: string): TokenSpec => ({
  label,
  hint,
  input: 'slider',
  min: -200,
  max: 200,
  step: 1,
  advanced: true,
});

const seconds = (label: string, hint?: string): TokenSpec => ({
  label,
  hint,
  input: 'duration',
  min: 0,
  max: 10,
  step: 0.1,
});

export const TOKEN_SPECS: { [property: string]: TokenSpec } = {
  // 共通 -----------------------------------------------------------------
  '--icon-size': size('Split icon size'),

  // Timeline -------------------------------------------------------------
  '--tl-text-color': { label: 'Text color' },
  '--tl-highlighted-text-color': { label: 'Text color when ahead of PB' },
  '--tl-background': { label: 'Background', hint: 'Keep it transparent to show your game through' },
  '--tl-font': { label: 'Label font', input: 'font' },
  '--tl-digits-font': { label: 'Time font', input: 'font' },
  '--tl-pb-timeline-width': width('PB column width', 'Set to 0 to collapse it'),
  '--tl-pace-timeline-width': width('Current pace column width'),

  '--tl-display-pb-timeline': { label: 'PB column' },
  '--tl-display-pb-timeline-title': { label: 'PB column title' },
  '--tl-display-pb-timeline-separator': { label: 'PB column separator line' },
  '--tl-display-pb-timeline-item-icon': { label: 'PB column icons' },
  '--tl-display-pb-timeline-item-label': { label: 'PB column split names' },
  '--tl-display-pb-timeline-item-time': { label: 'PB column times' },
  '--tl-display-pb-timeline-item-diff': { label: 'PB column difference' },
  '--tl-display-pb-timeline-empty': { label: 'PB column before the run starts', advanced: true },

  '--tl-display-pace-timeline': { label: 'Current pace column' },
  '--tl-display-pace-timeline-title': { label: 'Current pace title' },
  '--tl-display-pace-timeline-separator': { label: 'Current pace separator line' },
  '--tl-display-pace-timeline-item-icon': { label: 'Current pace icons' },
  '--tl-display-pace-timeline-item-label': { label: 'Current pace split names' },
  '--tl-display-pace-timeline-item-time': { label: 'Current pace times' },
  '--tl-display-pace-timeline-item-diff': { label: 'Difference from PB' },
  '--tl-display-pace-timeline-empty': { label: 'Pace column before the run starts', advanced: true },
  '--tl-display-pace-timeline-item-status-done': { label: 'Splits already passed', advanced: true },
  '--tl-display-pace-timeline-item-status-current': { label: 'The split just reached', advanced: true },
  '--tl-display-pace-timeline-item-status-next': { label: 'The split coming up', advanced: true },
  '--tl-display-pace-timeline-item-status-todo': { label: 'Splits still ahead', advanced: true },

  // Visual Timeline ------------------------------------------------------
  '--id-text-color': { label: 'Text color' },
  '--id-highlighted-text-color': { label: 'Text color when ahead of PB' },
  '--id-highlighted-shadow-color': { label: 'Glow when ahead of PB', advanced: true },
  '--id-background': { label: 'Background', hint: 'Keep it transparent to show your game through' },
  '--id-font': { label: 'Label font', input: 'font' },
  '--id-digits-font': { label: 'Time font', input: 'font' },
  '--id-width': {
    label: 'Bar width',
    hint: 'The whole bar spans your PB, so a longer bar spreads the splits out',
    input: 'slider',
    min: 200,
    max: 2560,
    step: 10,
  },
  '--id-offset': offset('Bar position from the top'),
  '--id-line-size': size('Bar thickness'),
  '--id-dot-size': size('Minute marker size'),
  '--id-pb-icon-size': size('PB icon size'),
  '--id-pace-icon-size': size('Current pace icon size'),
  '--id-pb-icon-offset': offset('PB icon position', 'Negative moves it above the bar'),
  '--id-pace-icon-offset': offset('Current pace icon position', 'Negative moves it above the bar'),
  '--id-done-pb-icon-size': size('PB icon size once passed', undefined, true),

  '--id-face-file': { label: 'Face image' },
  '--id-face-icon-size': size('Face size'),
  '--id-face-smile-file': { label: 'Face image when ahead of PB', advanced: true },
  '--id-face-sad-file': { label: 'Face image when behind PB', advanced: true },
  '--id-face-smile-shadow-color': { label: 'Glow around the face when ahead', advanced: true },
  '--id-face-completed-offset': offset('Face position after finishing'),

  '--id-display-indicator-empty': { label: 'Bar before the run starts', advanced: true },
  '--id-display-face-completed': { label: 'Face after finishing' },
  '--id-display-done-pb-item': { label: 'PB icons already passed', advanced: true },
  '--id-display-pace-text': { label: 'Split text on the bar' },
  '--id-display-pace-text-label': { label: 'Split names' },
  '--id-display-pace-text-time': { label: 'Split times' },
  '--id-display-pace-text-diff': { label: 'Difference from PB' },
  '--id-display-pace-text-rotate': { label: 'Tilt the split text', advanced: true },

  // Segment --------------------------------------------------------------
  '--sg-text-color': { label: 'Text color' },
  '--sg-background': { label: 'Background', hint: 'Keep it transparent to show your game through' },
  '--sg-font': { label: 'Label font', input: 'font' },
  '--sg-digits-font': { label: 'Time font', input: 'font' },
  '--sg-width': width('Width', 'Leave it as auto to fit the contents'),
  '--sg-icon-size': size('Icon size'),
  '--sg-banner-fade-in': seconds('Fade in', 'How long the banner takes to appear'),
  '--sg-banner-hold': seconds('Hold', 'How long it stays before fading out'),
  '--sg-banner-fade-out': seconds('Fade out'),

  '--sg-display-icon': { label: 'Icon' },
  '--sg-display-label1': { label: 'Split name' },
  '--sg-display-time': { label: 'Time' },
  '--sg-display-diff': { label: 'Difference from PB' },
  '--sg-display-background': { label: 'Background panel' },
  '--sg-display-decoration': { label: 'Decoration' },
  '--sg-display-empty': { label: 'Before the run starts', advanced: true },
};

/** 1枚だけ差し替えるアイコンは種別ごとに名前を作る */
export const getTokenSpec = (property: string): TokenSpec | undefined => {
  const spec = TOKEN_SPECS[property];
  if (spec) {
    return spec;
  }
  const icon = /^--icon-(.+)$/.exec(property);
  if (icon) {
    const name = icon[1].replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return { label: `${name} icon`, advanced: true };
  }
  return undefined;
};
