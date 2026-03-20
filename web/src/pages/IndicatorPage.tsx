import React from 'react';

import { usePageData } from '../hooks';
import { useSearchParams } from 'react-router-dom';
import { Indicator } from '../components/Indicator';
import { AppContext } from '../context';
import { DemoWarning } from '../components/DemoWarning';

export const IndicatorPage = () => {
  const [searchParams] = useSearchParams({ theme: 'default' });
  const theme = searchParams.get('theme') || 'default';
  const isDemo = searchParams.get('demo') === '1';

  const { isLoading, timeline, pbTimeline, setting, errors } = usePageData(theme, isDemo);

  if (isLoading) {
    return <></>;
  }

  if (errors.length > 0 || !timeline || !setting || !pbTimeline) {
    return (
      <div className="warning-container">
        {errors.map((error, i) => (
          <div key={i} className="warning">{error}</div>
        ))}
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ timeline, pbTimeline, theme, setting }}>
      {isDemo && <DemoWarning />}
      <Indicator />
    </AppContext.Provider>
  );
};
