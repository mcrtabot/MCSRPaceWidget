import React, { useContext } from 'react';

import { AppContext } from '../../context';
import { useThemeCSS } from '../../hooks';
import { Timeline } from './Timeline';

export const Timelines = () => {
  const { timeline, pbTimeline, theme, setting } = useContext(AppContext);
  useThemeCSS(theme, 'timeline');

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
