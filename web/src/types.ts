export type TimelineItem = {
  type: string;
  igt: number;
  /** チートを入れた時点より後ろを落とすのに使う。PB 側など持たない経路もある */
  rta?: number;
};

/**
 * 鉄インゴットや溶岩バケツなど、区間の境目ではない「途中の一点」。
 *
 * TimelineItem には混ぜないこと。Visual Timeline は「直前のイベント」で区間を
 * 塗るので、境目でないものを混ぜると塗り分けが崩れる。
 */
export type ContextMarker = {
  type: string;
  igt: number;
  rta?: number;
};

export type TimelineData = {
  timelines: TimelineItem[];
  /** サーバーが timer.igt の advancement から拾う。古い応答には無い */
  context?: ContextMarker[];
  igt: number | null;
};

export type PBSetting = { [key in string]?: string };

export type TimelineNextItemStyle = 'hyphen' | 'random' | 'igt';

export type Setting = {
  label: { [key: string]: string };
  /** 共通アイコンセットの id (icon/<id>/)。未指定ならテーマ同梱の icon/ を使う */
  iconSet?: string;
  /** true で Indicator の顔を走者のスキンにする */
  faceSkin?: boolean;
  /** context マーカーの表示名。ツールチップと data-label に使う */
  contextLabel?: { [key: string]: string };
  /** Visual Timeline で PB が無いときに最初から見せる幅（秒）。既定 600 */
  scaleMinSeconds?: number;
  /** Visual Timeline の横軸を伸ばす単位（秒）。既定 180 */
  scaleStepSeconds?: number;
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

/** /api/player の応答。id は Minecraft ID か UUID */
export type Player = {
  id: string;
  source: 'setting' | 'stats' | 'record';
};

/** /api/environment の応答。ウィジェットが動く前提が揃っているか */
export type Environment = {
  worldPath: string | null;
  /** SpeedRunIGT の Auto Save Interval。TICKS / PAUSE / NONE。読めなければ null */
  autoSaveInterval: string | null;
  optionsPath: string | null;
  autoSaveIntervalOk: boolean;
};
