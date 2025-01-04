export type StringTimelineItem = {
  type: string;
  igt: string; // mm:ss.fff
};

export type TimelineItem = {
  type: string;
  igt: number;
};
export type TimelineData = {
  timelines: TimelineItem[];
  igt: number | null;
};

export type PBSetting = { [key in string]?: string };

export type TimelineNextItemStyle = 'hyphen' | 'random' | 'igt';

export type Setting = {
  label: { [key: string]: string };
  pbTimelineTitle: string;
  paceTimelineTitle: string;
  nextItemStyle: TimelineNextItemStyle;
};

export type Theme = {
  name: string;
  timeline: boolean;
  indicator: boolean;
};

export const TIMELINE_EVENTS = [
  'overworld',
  'enter_nether',
  'enter_bastion',
  'enter_fortress',
  'first_portal',
  'enter_stronghold',
  'portal_room',
  'enter_end',
  'credits',
  'leave_bastion',
  'leave_fortress',
  'second_portal',
  'enter_nether2',
  'enter_bastion2',
  'enter_fortress2',
];
export type TimelineEvent = (typeof TIMELINE_EVENTS)[number];

export const SIMPLE_MODE_TIMELINE_EVENTS = [
  'overworld',
  'enter_nether',
  'enter_bastion',
  'enter_fortress',
  'first_portal',
  'enter_stronghold',
  'portal_room',
  'enter_end',
  'credits',
] as const;
export type SimpleModeTimelineEvent = (typeof SIMPLE_MODE_TIMELINE_EVENTS)[number];
