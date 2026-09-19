import { useEffect, useState } from 'react';

import { ThemeToken, parseThemeTokens } from '../../utils/cssTokens';

/** テーマCSSを読んで、編集できるトークンの一覧にする */
export const useThemeTokens = (theme: string, cssFile: string) => {
  const [tokens, setTokens] = useState<ThemeToken[]>([]);

  useEffect(() => {
    let aborted = false;
    fetch(`/theme/${theme}/${cssFile}.css`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.text() : ''))
      .then((css) => {
        if (!aborted) {
          setTokens(parseThemeTokens(css));
        }
      })
      .catch(() => {
        if (!aborted) {
          setTokens([]);
        }
      });
    return () => {
      aborted = true;
    };
  }, [theme, cssFile]);

  return tokens;
};
