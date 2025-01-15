import { useMemo } from 'react';
import { StringTimelineItem } from '../../types';

export type ImageCommonParameters = {
  theme: string;
  pixelsPerMinute: number;
  width: number;
  detailMode: boolean;
  backgroundColor: React.CSSProperties['backgroundColor'];
  textColor: React.CSSProperties['color'];
  transparent: boolean; // 画像の背景を透明にするかどうか
  useMinecraftFont: boolean;
  displayHeader: boolean;
  displayVisualTimeline: boolean;
  displayRunInfo: boolean;
  displayRunInfoAtFirstItem: boolean;
  displayTimeline: boolean;
  displayStats: boolean;
  displayNote: boolean;
  displayVisualTimelineTitle: boolean;
  displayMinutesDot: boolean;
};

export type ImageItemParameters = {
  key?: string;
  skin: string;
  name: string;
  date: string;
  title: string;
  timeline: StringTimelineItem[];
  note: string;
  runinfoTitle: string;
};

export const generateTitle = (itemParams: ImageItemParameters): string => {
  const { title: customTitle, timeline, name, date } = itemParams;
  if (customTitle) {
    return customTitle;
  }

  const time = timeline.find((item) => item.type === 'credits')?.igt || '';

  let title = '';
  if (name) {
    title += name;
  }

  if (time) {
    const strTime = time;
    if (title.length > 0) {
      title += ` - ${strTime}`;
    } else {
      title += strTime;
    }
  }

  if (date) {
    if (title.length > 0) {
      title += ` / ${date}`;
    } else {
      title += date;
    }
  }

  return title;
};

export const useTitle = (itemParams: ImageItemParameters) => {
  return useMemo(() => generateTitle(itemParams), [itemParams]);
};
