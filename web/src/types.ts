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
  /** 共通アイコンセットの id (icon/<id>/)。未指定ならテーマ同梱の icon/ を使う */
  iconSet?: string;
  segmentLabel: { [key: string]: string[] };
  enteringDuration: number;
  pbTimelineTitle: string;
  paceTimelineTitle: string;
  nextItemStyle: TimelineNextItemStyle;
};

export type Theme = {
  name: string;
  timeline: boolean;
  indicator: boolean;
  segment: boolean;
};

/** icon/<id>/icons.json の中身 */
export type IconSetData = {
  name: string;
  icons: { [type: string]: string };
};

/** 解決済みのアイコンセット。id は /icon/<id>/ のパスに使う */
export type IconSet = IconSetData & { id: string };
