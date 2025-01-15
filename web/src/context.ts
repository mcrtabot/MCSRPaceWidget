import { createContext } from 'react';
import { Setting, TimelineData, TimelineItem } from './types';
import { defaultSetting } from './setting';

export const AppContext = createContext<{
  theme: string;
  setting: Setting;
  timeline: TimelineData;
  pbTimeline: TimelineItem[];
  pixelsPerMinute?: number | null;
  detailMode?: boolean;
  displayMinutesDot?: boolean;
}>({
  theme: 'default',
  setting: defaultSetting,
  timeline: {
    igt: null,
    timelines: [],
  },
  pbTimeline: [],
});
