import { createContext } from 'react';

import { defaultSetting } from './setting';
import { IconSet, Setting, TimelineData, TimelineItem } from './types';

export const AppContext = createContext<{
  theme: string;
  setting: Setting;
  timeline: TimelineData;
  pbTimeline: TimelineItem[];
  /** 未指定ならテーマ同梱の icon/ にフォールバックする */
  iconSet?: IconSet;
}>({
  theme: 'default',
  setting: defaultSetting,
  timeline: {
    igt: null,
    timelines: [],
    context: [],
  },
  pbTimeline: [],
});
