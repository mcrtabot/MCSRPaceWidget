/**
 * テーマCSSの `:root` ブロックから、編集できるトークンを読み出す。
 *
 * スキーマを別ファイルで持たずCSSから直接読むのは、テーマ側で変数を足しても
 * 自動で編集対象になり、ユーザーの自作テーマもそのまま編集できるため。
 * 並び順はテーマ作者が書いた順のままにする（作者のグループ分けを尊重する）。
 */

export type TokenType = 'color' | 'length' | 'image' | 'toggle' | 'text';

export type ThemeToken = {
  property: string;
  /** テーマCSSに書かれている既定値。コメントアウトされている項目は空 */
  value: string;
  /** 直前のコメントから拾った説明 */
  label?: string;
  type: TokenType;
  /** toggle のとき、「表示する」側の値。`var(--x, table-cell)` の第2引数から取る */
  shownValue?: string;
};

const COLOR_KEYWORDS = new Set(['transparent', 'currentcolor', 'inherit', 'initial', 'unset', 'none', 'white', 'black']);

const isColor = (value: string) =>
  /^#[0-9a-f]{3,8}$/i.test(value) || /^(rgba?|hsla?)\(/i.test(value) || COLOR_KEYWORDS.has(value.toLowerCase());

const isLength = (value: string) => /^-?[\d.]+(px|%|em|rem|vh|vw)$/.test(value);

const inferType = (property: string, value: string, shownValue?: string): TokenType => {
  if (shownValue !== undefined || /(^|-)display-/.test(property)) {
    return 'toggle';
  }
  if (/^url\(/i.test(value)) {
    return 'image';
  }
  if (isLength(value)) {
    return 'length';
  }
  // 色に見えても transparent/none は toggle や text のことがあるので、値の形だけで決める
  if (isColor(value) && value.toLowerCase() !== 'none') {
    return 'color';
  }
  return 'text';
};

/** `display: var(--x, table-cell)` の第2引数を集める。toggle の「表示する」側の値になる */
const collectVarFallbacks = (css: string): { [property: string]: string } => {
  const fallbacks: { [property: string]: string } = {};
  const pattern = /var\(\s*(--[a-zA-Z0-9_-]+)\s*,\s*([^()]*?)\s*\)/g;
  let match = pattern.exec(css);
  while (match !== null) {
    const [, property, fallback] = match;
    if (fallback && !(property in fallbacks)) {
      fallbacks[property] = fallback;
    }
    match = pattern.exec(css);
  }
  return fallbacks;
};

/** `:root { ... }`。閉じ括弧はインデントされていることも、1行に詰まっていることもある */
const ROOT_BLOCK = /:root\s*\{([^{}]*)\}/;

/**
 * `:root` の中を上から読む。コメントアウトされた宣言も編集対象として拾う
 * （テーマ側で「使いたければ外す」形で用意されている項目のため）。
 */
export const parseThemeTokens = (css: string): ThemeToken[] => {
  const block = ROOT_BLOCK.exec(css);
  if (!block) {
    return [];
  }

  const fallbacks = collectVarFallbacks(css);
  const tokens: ThemeToken[] = [];
  const seen = new Set<string>();
  let pendingLabel: string | undefined;

  // コメントと宣言を、書かれている順に1つずつ見る
  const pattern = /\/\*([\s\S]*?)\*\/|(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  const body = block[1];
  let match = pattern.exec(body);

  while (match !== null) {
    const [, comment, property, value] = match;

    if (comment !== undefined) {
      const inner = comment.trim();
      const declaration = /^(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);?$/.exec(inner);
      if (declaration) {
        // コメントアウトされた宣言。既定は「書かれていない」状態なので値は空にする
        const [, commentedProperty] = declaration;
        if (!seen.has(commentedProperty)) {
          seen.add(commentedProperty);
          tokens.push({
            property: commentedProperty,
            value: '',
            label: pendingLabel,
            type: inferType(commentedProperty, declaration[2].trim(), fallbacks[commentedProperty]),
            shownValue: fallbacks[commentedProperty],
          });
        }
        // 直前のコメントはこの項目の説明。次の項目へ持ち越さない
        pendingLabel = undefined;
      } else if (inner && inner !== '') {
        pendingLabel = inner;
      }
      match = pattern.exec(body);
      continue;
    }

    if (property && !seen.has(property)) {
      seen.add(property);
      tokens.push({
        property,
        value: value.trim(),
        label: pendingLabel,
        type: inferType(property, value.trim(), fallbacks[property]),
        shownValue: fallbacks[property],
      });
    }
    pendingLabel = undefined;
    match = pattern.exec(body);
  }

  return tokens;
};

/** 画面に出す名前。コメントが無ければプロパティ名から機械的に作る */
export const tokenLabel = (token: ThemeToken) =>
  token.label ??
  token.property
    .replace(/^--/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
