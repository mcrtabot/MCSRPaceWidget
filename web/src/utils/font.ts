/**
 * CSS の font 略記を分解・再構成する。
 *
 * テーマは `normal bold 18px/1 sans-serif` のような略記で持っているが、
 * これをそのまま入力させると CSS を知らないと1文字も直せない。
 * フォント・太さ・大きさに分けて扱えるようにする。
 */

export type FontParts = {
  style: string;
  weight: string;
  size: string;
  lineHeight: string;
  family: string;
};

const STYLES = new Set(['italic', 'oblique']);
const WEIGHTS = new Set(['bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900']);

/** `18px` `18px/1.4` のような、大きさを表すトークン */
const SIZE_PATTERN = /^([\d.]+(?:px|em|rem|%|pt))(?:\/([\d.]+\w*))?$/;

export const parseFont = (value: string): FontParts | null => {
  const tokens = value.trim().split(/\s+/);
  const sizeIndex = tokens.findIndex((t) => SIZE_PATTERN.test(t));
  if (sizeIndex < 0 || sizeIndex === tokens.length - 1) {
    // 大きさが見つからない、または font-family が無い。略記として扱えない
    return null;
  }

  const m = SIZE_PATTERN.exec(tokens[sizeIndex]);
  const parts: FontParts = {
    style: 'normal',
    weight: 'normal',
    size: m?.[1] ?? '16px',
    lineHeight: m?.[2] ?? '1',
    // font-family は複数指定されるので、大きさより後ろを全部まとめて持つ
    family: tokens.slice(sizeIndex + 1).join(' '),
  };

  // 大きさより前は style / variant / weight が順不同で来る。キーワードで振り分ける
  for (const token of tokens.slice(0, sizeIndex)) {
    const lower = token.toLowerCase();
    if (STYLES.has(lower)) {
      parts.style = lower;
    } else if (WEIGHTS.has(lower)) {
      parts.weight = lower;
    }
  }

  return parts;
};

export const buildFont = (parts: FontParts): string =>
  `${parts.style} ${parts.weight} ${parts.size}/${parts.lineHeight} ${parts.family}`;

/** 選べるフォント。同梱している Minecraft フォントを先頭に置く */
export const FONT_FAMILIES: { label: string; value: string }[] = [
  { label: 'Minecraft', value: 'Minecraft-Regular, Minecraft, monospace, sans-serif' },
  { label: 'Sans-serif', value: 'sans-serif' },
  { label: 'System UI', value: 'ui-sans-serif, system-ui, -apple-system, sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
];

export const FONT_WEIGHTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Bold', value: 'bold' },
];
