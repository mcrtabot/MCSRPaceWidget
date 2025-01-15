import { DiffTime, Time } from '../common/Time';
import React, { useContext, useLayoutEffect, useMemo } from 'react';

import { AppContext } from '../../context';
import { TimelineIcon } from '../timeline/TimelineIcon';
import { TimelineItem } from '../../types';
import { useTimelineInfo } from '../../hooks';

export const Indicator = () => {
  const {
    timeline: timelineData,
    pbTimeline,
    theme,
    setting,
    detailMode = false, // 詳細モード(leave_bastionなどを表示)で表示するかどうか
  } = useContext(AppContext);
  useLayoutEffect(() => {
    const head = document.head;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `${process.env.REACT_APP_PATH_PREFIX}/theme/${theme}/indicator.css`;

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

  const pbFinalIGT = useMemo(() => Math.max(...timeline.map((item) => item.igt ?? 0)), [timeline]);
  const paceIGT = useMemo(() => {
    const finalIGT = timeline.find((item) => item.type === 'credits')?.igt;
    if (finalIGT) {
      return finalIGT;
    }

    return igt || 0;
  }, [igt, timeline]);

  const latestItem = timeline[timeline.length - 1];
  let faceStatus: 'normal' | 'smile' | 'sad' = 'normal';
  if (!paceIGT || !latestItem) {
    faceStatus = 'normal';
  } else if (paceIGT > pbFinalIGT) {
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
      if (faceStatusEnabled && latestItem.igt < (pbItem?.igt || 0) && paceIGT < (pbNextItem?.igt || 0)) {
        faceStatus = 'smile';
      }
    }
  }

  const classNames: string[] = [
    'mcsr-indicator',
    `mcsr-indicator--${timelineMap.has('credits') ? 'completed' : 'running'}`,
    `mcsr-indicator--${detailMode ? 'detail' : 'simple'}`,
  ];
  if (timeline.length === 0) {
    classNames.push('mcsr-indicator--empty');
  }

  const pbLineItems = getTimelineLineItems(pbTimeline, pbFinalIGT, pbFinalIGT);
  let lineItems = getTimelineLineItems(timeline, paceIGT || 0, pbFinalIGT);

  return (
    <div className={classNames.join(' ')}>
      <div className="mcsr-indicator__line-container">
        {pbLineItems
          .filter((lineItem) => lineItem.type !== 'credits')
          .map((lineItem, index) => (
            <div
              key={`${index}-${lineItem.type}`}
              className={`mcsr-indicator__line mcsr-indicator__line--pb mcsr-indicator__line--${lineItem.type}`}
              style={{ left: lineItem.left, width: lineItem.width }}
            />
          ))}
        {lineItems
          .filter((lineItem) => lineItem.type !== 'credits')
          .map((lineItem, index) => (
            <div
              key={`${index}-${lineItem.type}`}
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
        {displayItemTypes.map((itemType, index) => {
          const item = pbTimelineMap.get(itemType);
          if (!item) {
            return <React.Fragment key={itemType} />;
          }
          const status = timelineMap.has(itemType) ? 'done' : 'todo';
          return (
            <div
              key={`${index}-${itemType}`}
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
        {displayItemTypes.map((itemType, index) => {
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
              key={`${index}-${itemType}`}
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

type TimelineLineItemType = {
  type: string;
  left: string;
  width: string;
};

const getTimelineLineItems = (timeline: TimelineItem[], igt: number, pbFinalIGT: number): TimelineLineItemType[] => {
  let itemType = 'overworld';
  let itemStartIGT = 0;
  const lineItems: TimelineLineItemType[] = [];
  if (!igt) {
    return lineItems;
  }
  if (timeline.length > 0) {
    for (let i = 0; i < timeline.length; i++) {
      const left = calcPosition(itemStartIGT, pbFinalIGT);
      const width = calcPosition(timeline[i].igt - itemStartIGT, pbFinalIGT);

      lineItems.push({ left, width, type: itemType });

      itemType = timeline[i].type;
      itemStartIGT = timeline[i].igt;
    }
  }

  const left = calcPosition(itemStartIGT, pbFinalIGT);
  const width = calcPosition(igt - itemStartIGT, pbFinalIGT);
  lineItems.push({ left, width, type: itemType });

  return lineItems;
};

type TimelineDotItemType = {
  type: string;
  left: string;
};

const getTimelineDotItems = (timeline: TimelineItem[], igt: number, pbFinalIGT: number): TimelineDotItemType[] => {
  const dotItems: TimelineDotItemType[] = [];
  if (!igt) {
    return dotItems;
  }

  return range(1, Math.floor(igt / 60000)).map((minute: number) => {
    let itemType = 'overworld';
    if (timeline.length > 0) {
      for (let i = 0; i < timeline.length; i++) {
        if (timeline[i].igt > minute * 60000) {
          return { left: calcPosition(minute * 60000, pbFinalIGT), type: itemType };
        }
        itemType = timeline[i].type;
      }
    }
    return { left: calcPosition(minute * 60000, pbFinalIGT), type: itemType };
  });
};

export const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (v, k) => k + start);
