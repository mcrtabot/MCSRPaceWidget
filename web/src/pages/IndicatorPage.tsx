import React from 'react';

import { usePBTimeline, useSetting, useTimeline } from '../hooks';
import { useSearchParams } from 'react-router-dom';
import { Indicator } from '../components/Indicator';
import { AppContext } from '../context';
import { DemoWarning } from '../components/DemoWarning';

export const IndicatorPage = () => {
  const [searchParams] = useSearchParams({ theme: 'default' });
  const theme = searchParams.get('theme') || 'default';
  const isDemo = searchParams.get('demo') === '1';

  const { isLoading: isLoadingTimeline, data: timeline, hasError: hasErrorTimeline } = useTimeline(isDemo);
  const { isLoading: isLoadingPBTimeline, data: pbTimeline, hasError: hasErrorPBTimeline } = usePBTimeline(isDemo);
  const { isLoading: isLoadingSetting, setting, hasError: hasErrorSetting } = useSetting(theme, false);

  if (isLoadingTimeline || isLoadingSetting || isLoadingPBTimeline) {
    return <></>;
  }

  if (hasErrorTimeline || !timeline || hasErrorSetting || !setting || hasErrorPBTimeline || !pbTimeline) {
    return (
      <div className="warning-container">
        {(hasErrorTimeline || !timeline) && <div className="warning">No timeline data.</div>}
        {(hasErrorSetting || !setting) && (
          <div className="warning">file:theme/{theme}/setting.json does not exist or is in an invalid data format.</div>
        )}
        {(hasErrorPBTimeline || !pbTimeline) && (
          <div className="warning">file:setting/pb.json does not exist or is in an invalid data format.</div>
        )}
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
