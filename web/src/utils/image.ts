/** CSS の `url(...)` と素のパスを行き来する */

export const parseImageUrl = (value: string): string => {
  const m = /^\s*url\(\s*(['"]?)(.*?)\1\s*\)\s*$/.exec(value);
  return m ? m[2] : value.trim();
};

export const buildImageUrl = (url: string): string => (url ? `url(${url})` : 'none');
