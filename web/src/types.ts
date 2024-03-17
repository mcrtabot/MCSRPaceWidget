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
