import React, { useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import { DemoWarning } from '../components/ui/DemoWarning';
import { Timelines } from '../components/widget/Timelines';
import { AppContext } from '../context';
import { decodeOverrides } from '../utils/overrides';
import { usePageData, useThemeOverrides, useWidgetPage } from '../hooks';

export const TimelinePage = () => {
  const [searchParams] = useSearchParams({ theme: 'default', demo: '0' });
  const theme = searchParams.get('theme') || 'default';
  /*
   * preview=1 は一覧に埋め込むための指定。デモデータを使う点は demo=1 と同じだが、
   * 警告は出さない。警告は「そのURLをOBSに貼ってしまう」ことへの注意なので、
   * 埋め込みプレビューでは中身を覆うだけになる。
   */
  useWidgetPage();

  const isPreview = searchParams.get('preview') === '1';
  const isDemo = searchParams.get('demo') === '1' || isPreview;
  // ?icons=<セットid> でテーマの指定を上書きする
  const iconSetOverride = searchParams.get('icons') || undefined;
  // ?v=<base64> でテーマのトークンを上書きする
  const themeOverrides = useMemo(() => decodeOverrides(searchParams.get('v')), [searchParams]);
  useThemeOverrides(themeOverrides);

  const { isLoading, timeline, pbTimeline, setting, iconSet, errors } = usePageData(theme, isDemo, { iconSet: iconSetOverride });

  if (isLoading) {
    return <></>;
  }

  if (errors.length > 0 || !timeline || !setting || !pbTimeline) {
    return (
      <div className="warning-container">
        {errors.map((error, i) => (
          <div key={i} className="warning">
            {error}
          </div>
        ))}
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ timeline, pbTimeline, theme, setting, iconSet }}>
      {isDemo && !isPreview && <DemoWarning />}
      <Timelines />
    </AppContext.Provider>
  );
};
