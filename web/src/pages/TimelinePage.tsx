import React, { useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import { DemoWarning } from '../components/ui/DemoWarning';
import { Timelines } from '../components/widget/Timelines';
import { AppContext } from '../context';
import { decodeOverrides } from '../utils/overrides';
import { usePageData, useThemeOverrides } from '../hooks';

export const TimelinePage = () => {
  const [searchParams] = useSearchParams({ theme: 'default', demo: '0' });
  const theme = searchParams.get('theme') || 'default';
  const isDemo = searchParams.get('demo') === '1';
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
      {isDemo && <DemoWarning />}
      <Timelines />
    </AppContext.Provider>
  );
};
