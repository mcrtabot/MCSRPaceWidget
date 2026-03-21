import React from 'react';

import { useSearchParams } from 'react-router-dom';

import { DemoWarning } from '../components/ui/DemoWarning';
import { Segment } from '../components/widget/Segment';
import { AppContext } from '../context';
import { usePageData } from '../hooks';

export const SegmentPage = () => {
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
      <Segment />
    </AppContext.Provider>
  );
};
