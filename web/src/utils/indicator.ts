import { ContextMarker, TimelineItem } from '../types';

/** 0..1 の割合。位置の比較に使う。表示に使うのは calcPosition の方 */
const calcRatio = (igt?: number | null, pbFinalIGT?: number | null): number => {
  if (!pbFinalIGT) {
    return 0;
  }

  return (igt || 0) / pbFinalIGT;
};

export const calcPosition = (igt?: number | null, pbFinalIGT?: number | null): string => {
  return `${calcRatio(igt, pbFinalIGT) * 100}%`;
};

export type TimelineLineItem = {
  type: string;
  left: string;
  width: string;
};

export const getTimelineLineItems = (timeline: TimelineItem[], igt: number, pbFinalIGT: number): TimelineLineItem[] => {
  let itemType = 'overworld';
  let itemStartIGT = 0;
  const lineItems: TimelineLineItem[] = [];
  if (!igt) {
    return lineItems;
  }
  if (timeline.length > 0) {
    for (let i = 0; i < timeline.length; i++) {
      const left = calcPosition(itemStartIGT, pbFinalIGT);
      const width = calcPosition(timeline[i].igt - itemStartIGT, pbFinalIGT);

      lineItems.push({ left, width, type: itemType });

      itemType = timeline[i].type;
      itemStartIGT = timeline[i].igt;
    }
  }

  const left = calcPosition(itemStartIGT, pbFinalIGT);
  const width = calcPosition(igt - itemStartIGT, pbFinalIGT);
  lineItems.push({ left, width, type: itemType });

  return lineItems;
};

export type TimelineDotItem = {
  type: string;
  left: string;
};

const MILLISECONDS_PER_MINUTE = 60000;

export const getTimelineDotItems = (timeline: TimelineItem[], igt: number, pbFinalIGT: number): TimelineDotItem[] => {
  if (!igt) {
    return [];
  }

  return range(1, Math.floor(igt / MILLISECONDS_PER_MINUTE)).map((minute: number) => {
    let itemType = 'overworld';
    if (timeline.length > 0) {
      for (let i = 0; i < timeline.length; i++) {
        if (timeline[i].igt > minute * MILLISECONDS_PER_MINUTE) {
          return { left: calcPosition(minute * MILLISECONDS_PER_MINUTE, pbFinalIGT), type: itemType };
        }
        itemType = timeline[i].type;
      }
    }
    return { left: calcPosition(minute * MILLISECONDS_PER_MINUTE, pbFinalIGT), type: itemType };
  });
};

export const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (v, k) => k + start);

export type FaceStatus = 'normal' | 'smile' | 'sad';

export const getFaceStatus = (
  paceIGT: number,
  pbFinalIGT: number,
  latestItem: TimelineItem | undefined,
  pbTimeline: TimelineItem[],
  pbTimelinePattern: string,
  timelinePattern: string,
): FaceStatus => {
  if (!paceIGT || !latestItem) {
    return 'normal';
  }

  // PB に credits が無いと完走タイムが分からない。その場合はスプリット単位の比較だけで見る
  if (pbFinalIGT > 0 && paceIGT > pbFinalIGT) {
    return 'sad';
  }

  const pbItemIndex = pbTimeline.findIndex((item) => item.type === latestItem.type);
  if (pbItemIndex >= 0) {
    const faceStatusEnabled = !(
      pbTimelinePattern !== timelinePattern &&
      (latestItem.type === 'enter_fortress' || latestItem.type === 'enter_bastion')
    );

    const pbItem = pbTimeline[pbItemIndex];
    const pbNextItem = pbTimeline[pbItemIndex + 1];
    if (faceStatusEnabled && latestItem.igt < (pbItem?.igt || 0) && paceIGT < (pbNextItem?.igt || 0)) {
      return 'smile';
    }
  }

  return 'normal';
};

export type ContextItem = {
  left: string;
  item: ContextMarker;
};

/** context マーカーの位置。近いものが重なっても、まとめずに全部返す */
export const getContextItems = (context: ContextMarker[], denominator: number): ContextItem[] =>
  [...context]
    .sort((a, b) => a.igt - b.igt)
    // 分母の外は画面の外なので描かない
    .filter((item) => item.igt <= denominator)
    .map((item) => ({ left: calcPosition(item.igt, denominator), item }));
