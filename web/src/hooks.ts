import useSWR from 'swr/immutable';

import { defaultSetting } from './setting';
import { Setting, TimelineItem } from './types';

const REFRESH_INTERVAL = 60000;
const TIMELINE_REFRESH_INTERVAL = 500;

const fetcher = async (path: string) => {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('');
  }
  return await response.json();
};

const convertTimeToMilliSeconds = (time?: string) => {
  if (!time) {
    return undefined;
  }
  const match = time.match(/(?:(\d+):)?(\d{1,2}):(\d{1,2})(?:\.(\d+))?/);
  if (!match) {
    return undefined;
  }
  const h = match.at(1);
  const m = match.at(2);
  const s = match.at(3);
  const ms = match.at(4);
  return (
    (h ? parseInt(h, 10) * 60 * 60 * 1000 : 0) +
    (m ? parseInt(m, 10) * 60 * 1000 : 0) +
    (s ? parseInt(s, 10) * 1000 : 0) +
    (ms ? parseInt(ms, 10) : 0)
  );
};

export const useSetting = (theme: string | null) => {
  const path = `/theme/${theme}/setting.json`;
  const {
    isLoading,
    data: rawSetting,
    error,
  } = useSWR<Setting>(path, fetcher, { refreshInterval: REFRESH_INTERVAL, dedupingInterval: REFRESH_INTERVAL });

  if (isLoading || !rawSetting || !!error) {
    return { isLoading, setting: undefined, hasError: !!error };
  }

  const setting: Setting = { ...defaultSetting, ...rawSetting };

  return { isLoading, setting };
};

export const useTimeline = (isDemoMode: boolean) => {
  const path = !isDemoMode ? '/api/timeline' : '/demo/timeline.json';
  const { isLoading, data: timeline = [] } = useSWR<TimelineItem[]>(path, fetcher, {
    refreshInterval: TIMELINE_REFRESH_INTERVAL,
    dedupingInterval: TIMELINE_REFRESH_INTERVAL,
    errorRetryInterval: TIMELINE_REFRESH_INTERVAL,
  });

  // whether user left from world
  const left =
    timeline.findLastIndex((item) => item.type === 'leave_world') >
    timeline.findLastIndex((item) => item.type === 'rejoin_world');

  // ignore timeline items after enable cheats
  const enableCheatsIndex = timeline.findLastIndex((item) => item.type === 'enable_cheats');
  const data = left ? [] : enableCheatsIndex >= 0 ? timeline.slice(0, enableCheatsIndex) : timeline;

  return { isLoading, data, hasError: false };
};

export const usePBTimeline = (isDemoMode: boolean) => {
  const path = !isDemoMode ? '/setting/pb.json' : '/demo/pb.json';
  const {
    isLoading,
    data: rawPBSetting,
    error,
  } = useSWR<{ type: string; igt: string }[]>(path, fetcher, {
    refreshInterval: REFRESH_INTERVAL,
    dedupingInterval: REFRESH_INTERVAL,
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
