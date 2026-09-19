import React, { useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import { DemoWarning } from '../components/ui/DemoWarning';
import { Segment } from '../components/widget/Segment';
import { AppContext } from '../context';
import { decodeOverrides } from '../utils/overrides';
import { usePageData, useThemeOverrides } from '../hooks';

export const SegmentPage = () => {
  const [searchParams] = useSearchParams({ theme: 'default' });
  const theme = searchParams.get('theme') || 'default';
  const isDemo = searchParams.get('demo') === '1';
  // ?icons=<セットid> でテーマの指定を上書きする
  const iconSetOverride = searchParams.get('icons') || undefined;
  // ?v=<base64> でテーマのトークンを上書きする
  const themeOverrides = useMemo(() => decodeOverrides(searchParams.get('v')), [searchParams]);
  useThemeOverrides(themeOverrides);

  const { isLoading, timeline, pbTimeline, setting, iconSet, errors } = usePageData(theme, isDemo, iconSetOverride);

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
      {isDemo && <DemoWarning />}
      <Segment />
    </AppContext.Provider>
  );
};
