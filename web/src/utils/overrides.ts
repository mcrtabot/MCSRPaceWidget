/**
 * テーマのカスタムプロパティ差分を URL で持ち回るための変換。
 *
 * テーマ本体(CSS)はそのままに、`:root` のトークンだけを上書きする。
 * 差分だけを持つので、6項目ほどの変更なら URL は 300 字程度に収まる。
 */

export type ThemeOverrides = { [property: string]: string };

/** カスタムプロパティとして妥当な名前だけ受け付ける */
const PROPERTY_PATTERN = /^--[a-zA-Z0-9_-]+$/;

const MAX_PROPERTIES = 200;
const MAX_VALUE_LENGTH = 500;

const toBase64Url = (bytes: Uint8Array) => {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (encoded: string) => {
  const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
};

export const encodeOverrides = (overrides: ThemeOverrides): string =>
  toBase64Url(new TextEncoder().encode(JSON.stringify(overrides)));

/**
 * 壊れた値でウィジェットが真っ白にならないよう、読めなかった項目は黙って捨てる。
 * 値は CSSOM 経由で設定するので、宣言ブロックから抜け出される心配はない。
 */
export const decodeOverrides = (encoded: string | null | undefined): ThemeOverrides => {
  if (!encoded) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded)));
  } catch (e) {
    return {};
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {};
  }

  const overrides: ThemeOverrides = {};
  for (const [property, value] of Object.entries(parsed).slice(0, MAX_PROPERTIES)) {
    if (PROPERTY_PATTERN.test(property) && typeof value === 'string' && value.length <= MAX_VALUE_LENGTH) {
      overrides[property] = value;
    }
  }
  return overrides;
};
