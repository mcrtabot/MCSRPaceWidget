import React, { useContext, useMemo } from 'react';
import { useThemeCSS, useTimelineInfo } from '../hooks';
import { TimelineIcon } from './TimelineIcon';
import { DiffTime, Time } from './Time';
import { AppContext } from '../context';
import { calcPosition, getFaceStatus, getTimelineDotItems, getTimelineLineItems } from '../utils/indicator';

export const Indicator = () => {
  const { timeline: timelineData, pbTimeline, theme, setting } = useContext(AppContext);
  useThemeCSS(theme, 'indicator');

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
  const faceStatus = getFaceStatus(paceIGT, pbFinalIGT, latestItem, pbTimeline, pbTimelinePattern, timelinePattern);

  const classNames: string[] = [
    'mcsr-indicator',
    `mcsr-indicator--${timelineMap.has('credits') ? 'completed' : 'running'}`,
  ];
  if (timeline.length === 0) {
    classNames.push('mcsr-indicator--empty');
  }

  const pbLineItems = getTimelineLineItems(pbTimeline, pbFinalIGT, pbFinalIGT);
  const lineItems = getTimelineLineItems(timeline, paceIGT || 0, pbFinalIGT);

  return (
    <div className={classNames.join(' ')}>
      <div className="mcsr-indicator__line-container">
        {pbLineItems.map((lineItem) => (
          <div
            key={lineItem.type}
            className={`mcsr-indicator__line mcsr-indicator__line--pb mcsr-indicator__line--${lineItem.type}`}
            style={{ left: lineItem.left, width: lineItem.width }}
          />
        ))}
        {lineItems.map((lineItem) => (
          <div
            key={lineItem.type}
            className={`mcsr-indicator__line mcsr-indicator__line--pace mcsr-indicator__line--${lineItem.type}`}
            style={{ left: lineItem.left, width: lineItem.width }}
          />
        ))}
      </div>
      <div className="mcsr-indicator__dot-container">
        {getTimelineDotItems(pbTimeline, pbFinalIGT, pbFinalIGT).map((dotItem, index) => (
          <div
            key={`${dotItem.type}_${index}`}
            className={`mcsr-indicator__dot mcsr-indicator__dot--pb mcsr-indicator__dot--${dotItem.type}`}
            style={{ left: dotItem.left }}
          />
        ))}
        {getTimelineDotItems(timeline, paceIGT || 0, pbFinalIGT).map((dotItem, index) => (
          <div
            key={`${dotItem.type}_${index}`}
            className={`mcsr-indicator__dot mcsr-indicator__dot--pace mcsr-indicator__dot--${dotItem.type}`}
            style={{ left: dotItem.left }}
          />
        ))}
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
