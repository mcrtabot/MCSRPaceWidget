import React, { useLayoutEffect } from 'react';

import { TimelineItem } from '../../types';
import { convertMillisecondsToTime } from '../../utils/utils';

type StatsProps = {
  theme: string;
  timeline: TimelineItem[];
};

const STATS_KEYS = [
  'overworld',
  'nether',
  'blinded',
  'nether_move',
  'bastion',
  'fortress',
  'blinded_move',
  'stronghold',
  'end',
  'other',
  'total',
];
type StatsKey = (typeof STATS_KEYS)[number];
type StatsValues = { [key in StatsKey]: number };

const STATS_LABELS: { [key in StatsKey]: string } = {
  overworld: 'Overworld',
  nether: 'Nether',
  blinded: 'Blinded',
  nether_move: 'Nether Move',
  bastion: 'Bastion',
  fortress: 'Fortress',
  blinded_move: 'Blinded Move',
  stronghold: 'Stronghold',
  end: 'End',
  other: 'Other',
};

const aggregateStats = (timeline: TimelineItem[]) => {
  const stats: StatsValues = {
    overworld: 0,
    nether: 0,
    nether_move: 0,
    bastion: 0,
    fortress: 0,
    blinded_move: 0,
    stronghold: 0,
    end: 0,
    blinded: 0,
    other: 0,
    total: 0,
  };

  let is_blinded = false;
  let is_entered_nether = false;
  for (let i = 0; i < timeline.length; i++) {
    const event = timeline[i]?.type ?? 'overworld';
    const prevEvent = timeline[i - 1]?.type ?? 'overworld';
    const diff = timeline[i].igt - (timeline[i - 1]?.igt ?? 0);

    if (prevEvent === 'overworld') {
      stats.overworld += diff;
    } else if (prevEvent === 'overworld2') {
      if (!is_blinded) {
        stats.overworld += diff;
      } else {
        stats.blinded_move += diff;
      }
    } else if (['enter_nether', 'enter_nether2', 'leave_bastion', 'leave_fortress'].includes(prevEvent)) {
      if (!is_blinded) {
        stats.nether_move += diff;
      } else {
        stats.blinded_move += diff;
      }
    } else if (['enter_bastion', 'enter_bastion2'].includes(prevEvent)) {
      stats.bastion += diff;
    } else if (['enter_fortress', 'enter_fortress2'].includes(prevEvent)) {
      stats.fortress += diff;
    } else if (['first_portal', 'second_portal'].includes(prevEvent)) {
      stats.blinded_move += diff;
    } else if (['enter_stronghold', 'portal_room'].includes(prevEvent)) {
      stats.stronghold += diff;
    } else if (prevEvent === 'enter_end') {
      stats.end += diff;
    } else {
      stats.other += diff;
    }

    if (is_entered_nether) {
      if (!is_blinded) {
        stats.nether += diff;
      } else {
        stats.blinded += diff;
      }
    }

    if (event === 'enter_nether') {
      is_entered_nether = true;
    } else if (event === 'first_portal') {
      is_blinded = true;
    }
  }

  return stats;
};

export const Stats: React.FC<StatsProps> = ({ theme, timeline }) => {
  useLayoutEffect(() => {
    const head = document.head;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `${process.env.REACT_APP_PATH_PREFIX}/theme/${theme}/stats.css`;

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, [theme]);

  const stats = aggregateStats(timeline);

  return (
    <div className="mcsr-stats">
      <div className="mcsr-stats__items">
        {STATS_KEYS.map((key) => {
          const value = stats[key];
          if (key === 'other' && stats.other === 0) {
            return <React.Fragment key={key} />;
          }
          if (key === 'total') {
            return <React.Fragment key={key} />;
          }
          return (
            <div key={key} className={`mcsr-stats__item mcsr-stats__item--${key}`}>
              <div className={`mcsr-stats__item-icon mcsr-stats__item-icon--${key}`} />
              <div className={`mcsr-stats__item-label mcsr-stats__item-label--${key}`}>{STATS_LABELS[key]}</div>
              <div className={`mcsr-stats__item-time mcsr-stats__item-time--${key}`}>
                {convertMillisecondsToTime(value, false)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
