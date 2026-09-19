import { useEffect, useState } from 'react';

import { ThemeToken, parseThemeTokens } from '../../utils/cssTokens';

type State = { key: string; tokens: ThemeToken[]; loaded: boolean };

/** テーマCSSを読んで、編集できるトークンの一覧にする */
export const useThemeTokens = (theme: string, cssFile: string) => {
  const key = `${theme}/${cssFile}`;
  const [state, setState] = useState<State>({ key, tokens: [], loaded: false });

  /*
   * 別のテーマ/種別に移ったら、その場で空に戻す。effect の実行を待つと、
   * 1レンダーだけ「前のトークン一覧」と「新しい URL の上書き」が並ぶ。
   * 呼び出し側がその隙に両者を突き合わせると、上書きを消してしまう。
   */
  if (state.key !== key) {
    setState({ key, tokens: [], loaded: false });
  }

  useEffect(() => {
    let aborted = false;
    fetch(`/theme/${theme}/${cssFile}.css`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.text() : ''))
      .then((css) => {
        if (!aborted) {
          setState({ key: `${theme}/${cssFile}`, tokens: parseThemeTokens(css), loaded: true });
        }
      })
      .catch(() => {
        if (!aborted) {
          setState({ key: `${theme}/${cssFile}`, tokens: [], loaded: true });
        }
      });
    return () => {
      aborted = true;
    };
  }, [theme, cssFile]);

  return { tokens: state.tokens, loaded: state.loaded };
};
