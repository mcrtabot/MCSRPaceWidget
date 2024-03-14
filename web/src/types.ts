export type TimelineItem = {
  type: string;
  igt: number;
};

export type PBSetting = { [key in string]?: string };

export type TimelineNextItemStyle = 'hyphen' | 'random';

export type Setting = {
  label: { [key: string]: string };
  pbTimelineTitle: string;
  paceTimelineTitle: string;
  nextItemStyle: TimelineNextItemStyle;
};
