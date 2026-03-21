import { createContext } from 'react';

import { defaultSetting } from './setting';
import { Setting, TimelineData, TimelineItem } from './types';

export const AppContext = createContext<{
  theme: string;
  setting: Setting;
  timeline: TimelineData;
  pbTimeline: TimelineItem[];
}>({
  theme: 'default',
  setting: defaultSetting,
  timeline: {
    igt: null,
    timelines: [],
  },
  pbTimeline: [],
});
