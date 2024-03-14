import React, { useEffect } from 'react';

import { Timeline } from './components/Timeline';
import { AppContext } from './context';
import { usePBTimeline, useSetting, useTimeline } from './hooks';

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const isDemoMode = params.get('demo') === '1';
  const theme = params.get('theme') || 'default';

  const { isLoading: isLoadingTimeline, data: timeline, hasError: hasErrorTimeline } = useTimeline(isDemoMode);
  const { isLoading: isLoadingPBTimeline, data: pbTimeline, hasError: hasErrorPBTimeline } = usePBTimeline(isDemoMode);
  const { isLoading: isLoadingSetting, setting, hasError: hasErrorSetting } = useSetting(theme);

  useEffect(() => {
    const head = document.head;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `/theme/${theme}/style.css`;

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, [theme]);

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

  if (!timeline) {
    return <></>;
  }

  return (
    <AppContext.Provider value={{ theme }}>
      <div className="mcsr-widget">
        <div className="mcsr-widget-container">
          <Timeline
            className="timeline timeline--pb"
            timeline={pbTimeline || []}
            pbTimeline={pbTimeline}
            title={setting.pbTimelineTitle}
            labels={setting.label}
          />
          <Timeline
            className="timeline timeline--pace"
            timeline={timeline}
            pbTimeline={pbTimeline}
            labels={setting.label}
            title={setting.paceTimelineTitle}
            nextItemStyle={setting.nextItemStyle}
          />
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
