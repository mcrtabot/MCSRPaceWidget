import React from 'react';

import { TimelineItem, TimelineNextItemStyle } from '../types';
import { RandomTime } from './RandomTime';
import { DiffTime, Time } from './Time';
import { TimelineIcon as TLIcon } from './TimelineIcon';
import { useTimelineInfo } from '../hooks';

type TimelineProps = {
  className?: string;

  title?: string;
  timeline: TimelineItem[];
  pbTimeline?: TimelineItem[];
  igt?: number;

  nextItemStyle?: TimelineNextItemStyle;
  labels: { [key: string]: string };
};

export const Timeline = ({
  className,
  title,
  timeline: rawTimeline,
  igt = 0,
  pbTimeline,
  nextItemStyle = 'hyphen',
  labels,
}: TimelineProps) => {
  const { timeline, pbTimelinePattern, timelinePattern, displayItemTypes } = useTimelineInfo(
    rawTimeline,
    pbTimeline ?? [],
    labels,
  );

  const classNames: string[] = className?.split(' ') ?? [];
  if (timeline.length === 0) {
    classNames.push('timeline--empty');
  }

  return (
    <div className={classNames.join(' ')}>
      {title && (
        <>
          <div className="timeline__title">{title}</div>
          <hr className="timeline__separator" />
        </>
      )}
      <table className="timeline__container">
        <tbody>
          {displayItemTypes.map((type, index) => {
            const time = timeline.find((item) => item.type === type)?.igt ?? 0;
            const pbTime = pbTimeline?.find((item) => item.type === type)?.igt ?? 0;

            const diffEnabled =
              (type === 'enter_bastion' || type === 'enter_fortress') && pbTimelinePattern !== timelinePattern
                ? false
                : true;

            const highlighted = diffEnabled && time && pbTime && time < pbTime;

            const timelineStatus =
              index < timeline.length - 1
                ? 'done'
                : index === timeline.length - 1
                ? 'current'
                : index === timeline.length
                ? 'next'
                : 'todo';

            return (
              <tr
                key={type}
                className={[
                  'timeline__item',
                  `timeline__item--${highlighted ? 'highlighted' : 'normal'}`,
                  `timeline__item--${timelineStatus}`,
                ].join(' ')}
              >
                <td className="timeline__item__cell timeline__item__cell__icon">
                  <TLIcon className="timeline__item__icon" type={type} />
                </td>

                <td className="timeline__item__cell timeline__item__cell__label">
                  <div className="timeline__item__label">{labels[type] ?? type}</div>
                </td>

                <td className="timeline__item__cell timeline__item__cell__time">
                  <div className="timeline__item__time">
                    {timelineStatus === 'next' && nextItemStyle === 'random' ? (
                      <RandomTime />
                    ) : timelineStatus === 'next' && nextItemStyle === 'igt' ? (
                      <Time value={igt} />
                    ) : time ? (
                      <Time value={time} />
                    ) : (
                      '--:--'
                    )}
                  </div>
                </td>

                <td className="timeline__item__cell timeline__item__cell__diff">
                  <div className="timeline__item__diff">
                    {timelineStatus === 'next' && nextItemStyle === 'random' ? (
                      <RandomTime />
                    ) : timelineStatus === 'next' && nextItemStyle === 'igt' ? (
                      <DiffTime time={igt} pbTime={pbTime} displayDiff={diffEnabled} />
                    ) : (
                      <DiffTime time={time} pbTime={pbTime} displayDiff={diffEnabled} />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
