import React, { useContext } from 'react';

import { AppContext } from '../../context';
import { useThemeCSS } from '../../hooks';
import { Timeline } from './Timeline';

export const Timelines = () => {
  const { timeline, pbTimeline, theme, setting } = useContext(AppContext);
  useThemeCSS(theme, 'timeline');

  const currentSegment = timeline.timelines.length > 0 ? timeline.timelines[timeline.timelines.length - 1].type : '';
  const isCompleted = timeline.timelines.some((item) => item.type === 'credits');
  const status = timeline.timelines.length === 0 ? 'empty' : isCompleted ? 'completed' : 'running';

  return (
    <div className="mcsr-widget" data-segment={currentSegment} data-run-status={status}>
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
