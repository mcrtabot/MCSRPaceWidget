import React, { useMemo } from 'react';

import { TimelineItem, TimelineNextItemStyle } from '../types';
import { RandomTime } from './RandomTime';
import { Time } from './Time';
import { TimelineIcon as TLIcon } from './TimelineIcon';

type TimelineProps = {
  className?: string;

  title?: string;
  timeline: TimelineItem[];
  pbTimeline?: TimelineItem[];

  nextItemStyle?: TimelineNextItemStyle;
  labels: { [key: string]: string };
};

const getTimelinePattern = (timeline: TimelineItem[]) => {
  const enterBastionIndex = timeline.findIndex((item) => item.type === 'enter_bastion');
  const enterFortressIndex = timeline.findIndex((item) => item.type === 'enter_fortress');

  if (enterBastionIndex >= 0 && enterFortressIndex >= 0) {
    return enterBastionIndex < enterFortressIndex ? 'bf' : 'fb';
  } else if (enterFortressIndex >= 0) {
    return 'fb';
  }
  return 'bf';
};

export const Timeline = ({
  className,
  title,
  timeline: rawTimeline,
  pbTimeline,
  nextItemStyle = 'hyphen',
  labels,
}: TimelineProps) => {
  const timeline = useMemo(() => {
    const targetTypes = new Set([...Object.keys(labels), ...(pbTimeline?.map((item) => item.type) ?? [])]);
    return rawTimeline.filter((item) => targetTypes.has(item.type));
  }, [labels, pbTimeline, rawTimeline]);

  // 'bf': bastion -> fortress, 'fb': fortress -> bastion
  const pbTimelinePattern = useMemo(() => getTimelinePattern(pbTimeline || []), [pbTimeline]);
  const timelinePattern = useMemo(() => getTimelinePattern(timeline), [timeline]);

  const displayItemTypes = useMemo(() => {
    return [...timeline.map((item) => item.type), ...(pbTimeline?.map((item) => item.type) ?? [])].filter(
      (item, index, self) => self.indexOf(item) === index,
    );
  }, [pbTimeline, timeline]);

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
            const time = timeline?.find((item) => item.type === type)?.igt ?? 0;
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

type DiffTimeProps = {
  time?: number;
  pbTime: number;
  displayDiff?: boolean;
};

const DiffTime = ({ time, pbTime, displayDiff = true }: DiffTimeProps) => {
  return <>{time && pbTime && displayDiff ? <Time value={time - pbTime} displaySign={true} /> : '--:--'}</>;
};
