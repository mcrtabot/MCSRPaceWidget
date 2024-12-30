declare let RawDeflate: {
  deflate: (val: string) => string;
  inflate: (val: string) => string;
};

/**
 * 文字列を圧縮してbase64エンコードする
 */
export const deflate = (val: string): string => {
  val = encodeURIComponent(val); // UTF16 → UTF8
  val = RawDeflate.deflate(val); // 圧縮
  val = btoa(val); // base64エンコード
  val = val.replace(/\+/g, '-').replace(/\//g, '_');
  return val;
};

/**
 * 圧縮されたbase64エンコード文字列を復元する
 */
export const inflate = (val: string): string => {
  val = val.replace(/-/g, '+').replace(/_/g, '/');
  val = atob(val); // base64デコード
  val = RawDeflate.inflate(val); // 復号
  val = decodeURIComponent(val); // UTF8 → UTF16
  return val;
};
