import React, { useContext, useEffect } from 'react';

import { Timeline } from '../components/Timeline';
import { AppContext } from '../context';

export const Timelines = () => {
  const { timeline, pbTimeline, theme, setting } = useContext(AppContext);
  useEffect(() => {
    const head = document.head;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `/theme/${theme}/timeline.css`;

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, [theme]);

  return (
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
          timeline={timeline.timelines}
          pbTimeline={pbTimeline}
          igt={timeline.igt || 0}
          labels={setting.label}
          title={setting.paceTimelineTitle}
          nextItemStyle={setting.nextItemStyle}
        />
      </div>
    </div>
  );
};
