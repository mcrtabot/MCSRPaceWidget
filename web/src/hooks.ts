import { useEffect, useMemo } from 'react';

import useSWR from 'swr/immutable';

import demoPBTimeline from './assets/demo/pb.json';
import demoTimelineData from './assets/demo/timeline.json';
import { defaultSetting } from './setting';
import { IconSet, IconSetData, Setting, Theme, TimelineData, TimelineItem } from './types';
import { convertTimeToMilliSeconds } from './utils/utils';

const REFRESH_INTERVAL = 60000;
const TIMELINE_REFRESH_INTERVAL = 500;

const fetcher = async (path: string) => {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('');
  }
  return await response.json();
};

export const useSetting = (theme: string | null, isDemo: boolean) => {
  const path = `/theme/${theme}/setting.json`;
  const refreshInterval = isDemo ? 500 : REFRESH_INTERVAL;
  const {
    isLoading,
    data: rawSetting,
    error,
  } = useSWR<Setting>(path, fetcher, { refreshInterval, dedupingInterval: refreshInterval, refreshWhenHidden: true });

  if (isLoading || !rawSetting || !!error) {
    return { isLoading, setting: undefined, hasError: !!error };
  }

  const setting: Setting = { ...defaultSetting, ...rawSetting };

  return { isLoading, setting };
};

const fetchTimeline = async ([path, demo]: [string, boolean?]) => {
  if (!demo) {
    return await fetcher(path);
  }
  return demoTimelineData;
};

export const useTimeline = (demo?: boolean, igt?: number) => {
  const path = '/api/timeline';
  let { isLoading, data = { timelines: [], igt: null } } = useSWR<TimelineData>([path, demo], fetchTimeline, {
    refreshInterval: TIMELINE_REFRESH_INTERVAL,
    dedupingInterval: TIMELINE_REFRESH_INTERVAL,
    errorRetryInterval: TIMELINE_REFRESH_INTERVAL,
    refreshWhenHidden: true,
  });

  if (demo && igt !== undefined) {
    data = { igt: igt * 1000, timelines: demoTimelineData.timelines.filter((item) => item.igt <= igt * 1000) };
  }

  // whether user left from world
  const left =
    data.timelines.findLastIndex((item) => item.type === 'leave_world') >
    data.timelines.findLastIndex((item) => item.type === 'rejoin_world');

  // ignore timeline items after enable cheats
  const enableCheatsIndex = data.timelines.findLastIndex((item) => item.type === 'enable_cheats');
  const filteredTimelines = left
    ? []
    : enableCheatsIndex >= 0
      ? data.timelines.slice(0, enableCheatsIndex)
      : data.timelines;

  return { isLoading, data: { ...data, timelines: filteredTimelines }, hasError: false };
};

const fetchPBTimeline = async ([path, demo]: [string, boolean?]) => {
  if (!demo) {
    return await fetcher(path);
  }
  return demoPBTimeline;
};

export const usePBTimeline = (demo?: boolean) => {
  const path = '/setting/pb.json';
  const {
    isLoading,
    data: rawPBSetting,
    error,
  } = useSWR<{ type: string; igt: string }[]>([path, demo], fetchPBTimeline, {
    refreshInterval: REFRESH_INTERVAL,
    dedupingInterval: REFRESH_INTERVAL,
    refreshWhenHidden: true,
  });

  if (isLoading || !rawPBSetting || !!error) {
    return { isLoading, data: [], hasError: !!error };
  }
  const data = rawPBSetting
    .map((item) => ({
      type: item.type,
      igt: convertTimeToMilliSeconds(item.igt),
    }))
    .filter((item) => item.igt !== undefined) as TimelineItem[];

  return { isLoading, data, hasError: !!error };
};

export const useThemes = () => {
  const path = `/api/themes`;
  const {
    isLoading,
    data: themes,
    error,
  } = useSWR<Theme[]>(path, fetcher, { refreshInterval: REFRESH_INTERVAL, dedupingInterval: REFRESH_INTERVAL, refreshWhenHidden: true });

  if (isLoading || !themes || !!error) {
    return { isLoading, themes: undefined, hasError: !!error };
  }

  return { isLoading, data: themes, hasError: !!error };
};

/**
 * 共通アイコンセットを読む。id を渡さなければ何も取りに行かず undefined を返し、
 * 呼び出し側はテーマ同梱の icon/ にフォールバックする。
 *
 * 読み込み中に描き始めるとフォールバック先(テーマ同梱の icon/)を一瞬叩いてしまうので、
 * 呼び出し側は isLoading の間は描画を待つこと。
 */
export const useIconSet = (id?: string): { iconSet?: IconSet; isLoading: boolean } => {
  const { data, isLoading } = useSWR<IconSetData>(id ? `/icon/${id}/icons.json` : null, fetcher, {
    refreshInterval: REFRESH_INTERVAL,
    dedupingInterval: REFRESH_INTERVAL,
    refreshWhenHidden: true,
  });

  return { iconSet: id && data?.icons ? { ...data, id } : undefined, isLoading: !!id && isLoading };
};

/** 一覧。テーマエディタのアイコン選択で使う */
export const useIconSets = () => {
  const path = `/api/icons`;
  const {
    isLoading,
    data: iconSets,
    error,
  } = useSWR<IconSet[]>(path, fetcher, {
    refreshInterval: REFRESH_INTERVAL,
    dedupingInterval: REFRESH_INTERVAL,
    refreshWhenHidden: true,
  });

  return { isLoading, data: iconSets, hasError: !!error };
};

export const useTimelineInfo = (
  rawTimeline: TimelineItem[],
  pbTimeline: TimelineItem[],
  labels: { [key: string]: string },
) => {
  const timeline = useMemo(() => {
    const targetTypes = new Set([...Object.keys(labels), ...(pbTimeline.map((item) => item.type) ?? [])]);
    return rawTimeline.filter((item) => targetTypes.has(item.type));
  }, [labels, pbTimeline, rawTimeline]);

  // 'bf': bastion -> fortress, 'fb': fortress -> bastion
  const pbTimelinePattern = useMemo(() => getTimelinePattern(pbTimeline || []), [pbTimeline]);
  const timelinePattern = useMemo(() => getTimelinePattern(timeline), [timeline]);

  const displayItemTypes = useMemo(() => {
    return [...timeline.map((item) => item.type), ...(pbTimeline.map((item) => item.type) ?? [])].filter(
      (item, index, self) => self.indexOf(item) === index,
    );
  }, [pbTimeline, timeline]);

  return { timeline, pbTimelinePattern, timelinePattern, displayItemTypes };
};

const getTimelinePattern = (timeline: TimelineItem[]) => {
  const enterBastionIndex = timeline.findIndex((item) => item.type === 'enter_bastion');
  const enterFortressIndex = timeline.findIndex((item) => item.type === 'enter_fortress');

  if (enterBastionIndex >= 0 && enterFortressIndex >= 0) {
    return enterBastionIndex < enterFortressIndex ? 'bf' : 'fb';
  } else if (enterFortressIndex >= 0) {
    return 'fb' as const;
  }
  return 'bf' as const;
};

export const useThemeCSS = (theme: string, cssFile: 'timeline' | 'indicator' | 'segment') => {
  useEffect(() => {
    const head = document.head;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `/theme/${theme}/${cssFile}.css`;

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, [theme, cssFile]);
};

export const usePageData = (theme: string, isDemo: boolean, iconSetOverride?: string) => {
  const { isLoading: isLoadingTimeline, data: timeline, hasError: hasErrorTimeline } = useTimeline(isDemo);
  const { isLoading: isLoadingPBTimeline, data: pbTimeline, hasError: hasErrorPBTimeline } = usePBTimeline(isDemo);
  const { isLoading: isLoadingSetting, setting, hasError: hasErrorSetting } = useSetting(theme, false);
  // URL の指定 > テーマの setting.json > テーマ同梱の icon/
  const { iconSet, isLoading: isLoadingIconSet } = useIconSet(iconSetOverride || setting?.iconSet);

  const isLoading = isLoadingTimeline || isLoadingSetting || isLoadingPBTimeline || isLoadingIconSet;

  const errors: string[] = [];
  if (hasErrorTimeline || (!isLoading && !timeline)) errors.push('No timeline data.');
  if (hasErrorSetting || (!isLoading && !setting))
    errors.push(`file:theme/${theme}/setting.json does not exist or is in an invalid data format.`);
  if (hasErrorPBTimeline || (!isLoading && !pbTimeline))
    errors.push('file:setting/pb.json does not exist or is in an invalid data format.');

  return { isLoading, timeline, pbTimeline, setting, iconSet, errors };
};
