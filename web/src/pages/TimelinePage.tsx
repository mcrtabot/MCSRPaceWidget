import React from 'react';

import { useSearchParams } from 'react-router-dom';

import { DemoWarning } from '../components/ui/DemoWarning';
import { Timelines } from '../components/widget/Timelines';
import { AppContext } from '../context';
import { usePageData } from '../hooks';

export const TimelinePage = () => {
  const [searchParams] = useSearchParams({ theme: 'default', demo: '0' });
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
          <div key={i} className="warning">
            {error}
          </div>
        ))}
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ timeline, pbTimeline, theme, setting }}>
      {isDemo && <DemoWarning />}
      <Timelines />
    </AppContext.Provider>
  );
};
