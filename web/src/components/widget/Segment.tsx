import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { AppContext } from '../../context';
import { useThemeCSS, useTimelineInfo } from '../../hooks';
import { DiffTime, Time } from './Time';
import { TimelineIcon } from './TimelineIcon';

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
  const prevTypeRef = useRef<string | null>(null);
  const [entering, setEntering] = useState(false);
  const [enterKey, setEnterKey] = useState(0);

  useEffect(() => {
    if (currentType !== prevTypeRef.current) {
      prevTypeRef.current = currentType;
      if (currentType !== null) {
        setEntering(false);
        // Force a re-render cycle so React removes data-entering="true" before re-adding it
        requestAnimationFrame(() => {
          setEntering(true);
          setEnterKey((k) => k + 1);
        });
      } else {
        setEntering(false);
      }
    }
  }, [currentType]);

  useEffect(() => {
    if (!entering) return;
    const timer = setTimeout(() => setEntering(false), enteringDuration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterKey, enteringDuration]);

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
      className={`mcsr-segment mcsr-segment--${status}`}
      data-entering={entering}
      data-segment={currentType ?? ''}
      data-highlighted={highlighted}
    >
      <div className={`mcsr-segment__background mcsr-segment__background--${currentType ?? 'none'}`} />

      <div className="mcsr-segment__content">
        <div className="mcsr-segment__icon-area">
          {currentType && <TimelineIcon className="mcsr-segment__icon" type={currentType} />}
        </div>

        {labels.map((text, i) => (
          <div key={i} className={`mcsr-segment__label${i + 1}`} style={{ gridArea: `label${i + 1}` }}>
            {i === 0 && currentType && <TimelineIcon className="mcsr-segment__label-icon" type={currentType} />}
            <span className="mcsr-segment__label-text">{text}</span>
          </div>
        ))}

        <div className="mcsr-segment__time">{currentItem ? <Time value={currentItem.igt} /> : '--:--'}</div>

        <div className="mcsr-segment__diff">
          {currentItem && diffEnabled ? <DiffTime time={currentItem.igt} pbTime={pbTime} /> : ''}
        </div>
      </div>

      <div className={`mcsr-segment__decoration mcsr-segment__decoration--${currentType ?? 'none'}`} />
    </div>
  );
};
