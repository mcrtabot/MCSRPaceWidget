import React, { useContext, useEffect, useMemo } from 'react';
import { useTimelineInfo } from '../hooks';
import { TimelineIcon } from './TimelineIcon';
import { DiffTime, Time } from './Time';
import { AppContext } from '../context';

export const Indicator = () => {
  const { timeline: timelineData, pbTimeline, theme, setting } = useContext(AppContext);
  useEffect(() => {
    const head = document.head;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `/theme/${theme}/indicator.css`;

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, [theme]);

  const igt = timelineData.igt;
  const { timeline, pbTimelinePattern, timelinePattern, displayItemTypes } = useTimelineInfo(
    timelineData.timelines,
    pbTimeline ?? [],
    setting.label,
  );

  const timelineMap = useMemo(() => new Map(timeline.map((item) => [item.type, item])), [timeline]);
  const pbTimelineMap = useMemo(() => new Map(pbTimeline.map((item) => [item.type, item])), [pbTimeline]);

  const pbFinalIGT = useMemo(() => pbTimeline.find((item) => item.type === 'credits')?.igt ?? 0, [pbTimeline]);
  const paceIGT = useMemo(() => {
    const finalIGT = timeline.find((item) => item.type === 'credits')?.igt;
    if (finalIGT) {
      return finalIGT;
    }

    return igt || 0;
  }, [igt, timeline]);

  const latestItem = timeline[timeline.length - 1];
  let faceStatus: 'normal' | 'smile' | 'sad' = 'normal';
  if (!igt || !latestItem) {
    faceStatus = 'normal';
  } else if (igt > pbFinalIGT) {
    faceStatus = 'sad';
  } else {
    const pbItemIndex = pbTimeline.findIndex((item) => item.type === latestItem.type);
    if (pbItemIndex >= 0) {
      const faceStatusEnabled = !(
        pbTimelinePattern !== timelinePattern &&
        (latestItem.type === 'enter_fortress' || latestItem.type === 'enter_bastion')
      );

      const pbItem = pbTimeline[pbItemIndex];
      const pbNextItem = pbTimeline[pbItemIndex + 1];
      if (faceStatusEnabled && latestItem.igt < (pbItem.igt || 0) && igt < (pbNextItem.igt || 0)) {
        faceStatus = 'smile';
      }
    }
  }

  const paceLineLength = useMemo(() => calcPosition(paceIGT, pbFinalIGT), [paceIGT, pbFinalIGT]);

  const classNames: string[] = [
    'mcsr-indicator',
    `mcsr-indicator--${timelineMap.has('credits') ? 'completed' : 'running'}`,
  ];
  if (timeline.length === 0) {
    classNames.push('mcsr-indicator--empty');
  }

  return (
    <div className={classNames.join(' ')}>
      <div className="mcsr-indicator__line-container">
        <div className="mcsr-indicator__line" />
        <div className="mcsr-indicator__line mcsr-indicator__line--pace" style={{ width: paceLineLength }} />
      </div>
      <div className="mcsr-indicator__dot-container">
        {range(1, Math.floor(pbFinalIGT / 60000)).map((minute: number) => {
          return (
            <div
              key={minute}
              className="mcsr-indicator__dot"
              style={{ left: calcPosition(minute * 60000, pbFinalIGT) }}
            />
          );
        })}
        {range(1, Math.floor(paceIGT / 60000)).map((minute: number) => {
          return (
            <div
              key={minute}
              className="mcsr-indicator__dot mcsr-indicator__dot--pace"
              style={{ left: calcPosition(minute * 60000, pbFinalIGT) }}
            />
          );
        })}
      </div>
      <div className="mcsr-indicator__timeline-container mcsr-indicator__timeline-container--pb">
        {displayItemTypes.map((itemType) => {
          const item = pbTimelineMap.get(itemType);
          if (!item) {
            return <React.Fragment key={itemType} />;
          }
          const status = timelineMap.has(itemType) ? 'done' : 'todo';
          return (
            <div
              key={itemType}
              className={['mcsr-indicator__item', `mcsr-indicator__item--${status}`].join(' ')}
              style={{ left: calcPosition(item.igt, pbFinalIGT) }}
            >
              <div className="mcsr-indicator__icon-container">
                <TimelineIcon className="mcsr-indicator__icon" type={itemType} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mcsr-indicator__timeline-container mcsr-indicator__timeline-container--pace">
        {displayItemTypes.map((itemType) => {
          const item = timelineMap.get(itemType);
          if (!item) {
            return <React.Fragment key={itemType} />;
          }

          const diffEnabled =
            (itemType === 'enter_bastion' || itemType === 'enter_fortress') && pbTimelinePattern !== timelinePattern
              ? false
              : true;
          const highlighted = diffEnabled && item.igt < (pbTimelineMap.get(itemType)?.igt ?? 0);
          return (
            <div
              key={itemType}
              className={[
                'mcsr-indicator__item',
                `mcsr-indicator__item--${highlighted ? 'highlighted' : 'normal'}`,
              ].join(' ')}
              style={{ left: calcPosition(item.igt, pbFinalIGT) }}
            >
              <div className="mcsr-indicator__icon-container">
                <TimelineIcon className="mcsr-indicator__icon" type={itemType} />
              </div>
              <div className="mcsr-indicator__text">
                <div className="mcsr-indicator__text-inner">
                  <div className="mcsr-indicator__text__label">{setting.label[item.type]}</div>
                  <div className="mcsr-indicator__text__time">
                    <Time value={item.igt} />
                  </div>
                  {diffEnabled && (
                    <div className="mcsr-indicator__text__diff">
                      (
                      <DiffTime time={item.igt} pbTime={pbTimelineMap.get(itemType)?.igt} />)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mcsr-indicator__face-container">
        <div
          className={['mcsr-indicator__face', `mcsr-indicator__face--${faceStatus}`, 'mcsr-indicator__icon'].join(' ')}
          style={{ left: calcPosition(paceIGT, pbFinalIGT) }}
        />
      </div>
    </div>
  );
};

const calcPosition = (igt?: number | null, pbFinalIGT?: number | null) => {
  if (!pbFinalIGT) {
    return '0%';
  }

  return `${((igt || 0) / pbFinalIGT) * 100}%`;
};
export const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (v, k) => k + start);
