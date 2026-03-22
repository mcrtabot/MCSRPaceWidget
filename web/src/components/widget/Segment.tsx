import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { AppContext } from '../../context';
import { useThemeCSS, useTimelineInfo } from '../../hooks';
import { DiffTime, Time } from './Time';
import { TimelineIcon } from './TimelineIcon';
import { RandomTime } from './RandomTime';

const DEFAULT_ENTERING_DURATION = 5000;

export const Segment = () => {
  const { timeline: timelineData, pbTimeline, theme, setting } = useContext(AppContext);
  const enteringDuration = setting.enteringDuration ?? DEFAULT_ENTERING_DURATION;
  useThemeCSS(theme, 'segment');

  const { timeline, pbTimelinePattern, timelinePattern } = useTimelineInfo(
    timelineData.timelines,
    pbTimeline ?? [],
    setting.label,
  );

  const pbTimelineMap = useMemo(() => new Map(pbTimeline.map((item) => [item.type, item])), [pbTimeline]);

  // Current segment = last completed timeline event
  const currentItem = timeline.length > 0 ? timeline[timeline.length - 1] : null;
  const currentType = currentItem?.type ?? null;

  // Detect segment change → set entering state
  // Using enterKey as React key on root div forces DOM remount = guaranteed animation restart
  const prevTypeRef = useRef<string | null>(null);
  const [entering, setEntering] = useState(false);
  const [enterKey, setEnterKey] = useState(0);

  useEffect(() => {
    if (currentType !== prevTypeRef.current) {
      prevTypeRef.current = currentType;
      if (currentType !== null) {
        setEntering(true);
        setEnterKey((k) => k + 1);
      } else {
        setEntering(false);
      }
    }
  }, [currentType]);

  useEffect(() => {
    if (!entering) return;
    const timer = setTimeout(() => setEntering(false), enteringDuration);
    return () => clearTimeout(timer);
  }, [enterKey, entering, enteringDuration]);

  // Diff calculation
  const pbTime = currentType ? pbTimelineMap.get(currentType)?.igt : undefined;
  const diffEnabled =
    currentType &&
    !((currentType === 'enter_bastion' || currentType === 'enter_fortress') && pbTimelinePattern !== timelinePattern);

  // Labels: segmentLabel (array) takes priority, fallback to label (single)
  const labels = useMemo(() => {
    if (!currentType) return [''];
    const segLabels = setting.segmentLabel?.[currentType];
    if (segLabels && segLabels.length > 0) return segLabels;
    return [setting.label[currentType] ?? currentType];
  }, [currentType, setting]);

  // Highlighted: current split is faster than PB
  const highlighted = !!(currentItem && diffEnabled && pbTime && currentItem.igt < pbTime);

  // Status
  const isCompleted = timeline.some((item) => item.type === 'credits');
  const status = timeline.length === 0 ? 'empty' : isCompleted ? 'completed' : 'running';

  return (
    <div
      key={enterKey}
      className={`mcsr-segment mcsr-segment--${status}`}
      data-entering={entering}
      data-segment={currentType ?? ''}
      data-run-status={status}
      data-highlighted={highlighted}
    >
      <div className={`mcsr-segment__background mcsr-segment__background--${currentType ?? 'none'}`} />

      <div className="mcsr-segment__content">
        <div className="mcsr-segment__icon-area">
          {currentType && <TimelineIcon className="mcsr-segment__icon" type={currentType} />}
        </div>

        {labels.map((text, i) => (
          <div key={i} className={`mcsr-segment__label${i + 1}`}>
            {text}
          </div>
        ))}

        <div className="mcsr-segment__time">
          {currentItem ? (
            <Time value={currentItem.igt} />
          ) : setting.nextItemStyle === 'random' ? (
            <RandomTime />
          ) : (
            '--:--'
          )}
        </div>

        <div className="mcsr-segment__diff">
          {currentItem && diffEnabled ? <DiffTime time={currentItem.igt} pbTime={pbTime} /> : ''}
        </div>
      </div>

      <div className={`mcsr-segment__decoration mcsr-segment__decoration--${currentType ?? 'none'}`} />
    </div>
  );
};
