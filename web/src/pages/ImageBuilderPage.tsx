import { ImageBuilder } from '../components/builder/ImageBuilder';
import React, { useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { StringTimelineItem } from '../types';
import { ImageCommonParameters, ImageItemParameters } from '../components/builder';
import { deflate, inflate } from '../utils/compress';

const DEFAULT_THEME = 'builder';
const DEFAULT_PIXELS_PER_MINUTE = 0;
const DEFAULT_WIDTH = 1280;
const DEFAULT_DETAILED_MODE = false;
const DEFAULT_TRANSPARENT = false;
const DEFAULT_BACKGROUND_COLOR = '333333';
const DEFAULT_TEXT_COLOR = 'ffffff';
const DEFAULT_USE_MINECRAFT_FONT = true;
const DETAULT_DISPLAY_HEADER = false;
const DETAULT_DISPLAY_VISUAL_TIMELINE = true;
const DETAULT_DISPLAY_VISUAL_TIMELINE_TITLE = false;
const DETAULT_DISPLAY_RUN_INFO = true;
const DETAULT_DISPLAY_TIMELINE = true;
const DETAULT_DISPLAY_STATS = true;
const DETAULT_DISPLAY_NOTE = true;

const IMAGE_COMMON_PARAMS_PARAMTER = 'c';
const IMAGE_ITEM_PARAMS_PARAMTER = 'i';
const SKIN_PARAMETER = 's';
const NAME_PARAMETER = 'n';
const DATE_PARAMETER = 'd';
const TITLE_PARAMETER = 't';
const THEME_PARAMETER = 'tm';
const SCALE_PARAMETER = 'sc';
const WIDTH_PARAMETER = 'w';
const DETAILED_MODE_PARAMETER = 'dm';
const BACKGROUND_COLOR_PARAMETER = 'bc';
const TEXT_COLOR_PARAMETER = 'tc';
const TRANSPARENT_PARAMETER = 'tp';
const TIMELINE_PARAMETER = 'tl';
const USE_MINECRAFT_FONT_PARAMETER = 'mf';
const NOTE_PARAMETER = 'nt';
const DISPLAY_HEADER_PARAMETER = 'dh';
const DISPLAY_VISUAL_TIMELINE_PARAMETER = 'dv';
const DISPLAY_VISUAL_TIMELINE_TITLE_PARAMETER = 'dvt';
const DISPLAY_RUN_INFO_PARAMETER = 'dr';
const DISPLAY_TIMELINE_PARAMETER = 'dt';
const DISPLAY_STATS_PARAMETER = 'ds';
const DISPLAY_NOTE_PARAMETER = 'dn';
const RUNINFO_TITLE_PARAMETER = 'rt';

const TIMELINE_EVENT_MAP = {
  enter_nether: 'en',
  enter_bastion: 'eb',
  leave_bastion: 'lb',
  enter_fortress: 'ef',
  leave_fortress: 'lf',
  first_portal: 'fp',
  second_portal: 'sp',
  enter_stronghold: 'es',
  portal_room: 'pr',
  enter_end: 'ee',
  credits: 'fn',
  enter_nether2: 'en2',
  enter_bastion2: 'eb2',
  enter_fortress2: 'ef2',
};
const REVERSE_TIMELINE_EVENT_MAP = Object.fromEntries(
  Object.entries(TIMELINE_EVENT_MAP).map(([key, value]) => [value, key]),
);

const parseTimeline = (searchParams: URLSearchParams): StringTimelineItem[] => {
  const timelineString = searchParams.get(TIMELINE_PARAMETER) || '';
  const strTimeline = timelineString.split('/').map((item) => {
    const [type, igt] = item.split(',');
    return { type, igt };
  });

  const timeline = strTimeline
    .map((item) => ({
      type: REVERSE_TIMELINE_EVENT_MAP[item.type] || item.type,
      igt: item.igt,
    }))
    .filter((item) => item.igt !== undefined);

  return timeline;
};

const getStringValue = (searchParams: URLSearchParams, key: string, defaultValue: string): string => {
  return searchParams.get(key) || defaultValue;
};
const getNumberValue = (searchParams: URLSearchParams, key: string, defaultValue: number): number => {
  if (searchParams.get(key)) {
    return parseInt(searchParams.get(key) || '', 10);
  }
  return defaultValue;
};
const getBooleanValue = (searchParams: URLSearchParams, key: string, defaultValue: boolean): boolean => {
  if (searchParams.get(key)) {
    return searchParams.get(key) === '1';
  }
  return defaultValue;
};
const getColorValue = (searchParams: URLSearchParams, key: string, defaultValue: string): string => {
  let color = searchParams.get(key) || defaultValue;
  if (color.match(/^[0-9a-fA-F]{3}$/) || color.match(/^[0-9a-fA-F]{6}$/)) {
    color = `#${color}`;
  }
  return color;
};

const parseBuilderParams = (searchParams: URLSearchParams): [ImageCommonParameters, ImageItemParameters[]] => {
  const compressedCommonSearchParams = searchParams.get(IMAGE_COMMON_PARAMS_PARAMTER) || '';
  const commonSearchParams = new URLSearchParams(inflate(compressedCommonSearchParams));
  const theme = getStringValue(commonSearchParams, THEME_PARAMETER, DEFAULT_THEME);
  const detailMode = getBooleanValue(commonSearchParams, DETAILED_MODE_PARAMETER, false);
  const pixelsPerMinute = getNumberValue(commonSearchParams, SCALE_PARAMETER, DEFAULT_PIXELS_PER_MINUTE);
  const width = getNumberValue(commonSearchParams, WIDTH_PARAMETER, DEFAULT_WIDTH);
  const backgroundColor = getColorValue(commonSearchParams, BACKGROUND_COLOR_PARAMETER, DEFAULT_BACKGROUND_COLOR);
  const textColor = getColorValue(commonSearchParams, TEXT_COLOR_PARAMETER, DEFAULT_TEXT_COLOR);
  const transparent = getBooleanValue(commonSearchParams, TRANSPARENT_PARAMETER, DEFAULT_TRANSPARENT);
  const useMinecraftFont = getBooleanValue(
    commonSearchParams,
    USE_MINECRAFT_FONT_PARAMETER,
    DEFAULT_USE_MINECRAFT_FONT,
  );
  const displayHeader = getBooleanValue(commonSearchParams, DISPLAY_HEADER_PARAMETER, DETAULT_DISPLAY_HEADER);
  const displayVisualTimeline = getBooleanValue(
    commonSearchParams,
    DISPLAY_VISUAL_TIMELINE_PARAMETER,
    DETAULT_DISPLAY_VISUAL_TIMELINE,
  );
  const displayVisualTimelineTitle = getBooleanValue(
    commonSearchParams,
    DISPLAY_VISUAL_TIMELINE_TITLE_PARAMETER,
    DETAULT_DISPLAY_VISUAL_TIMELINE_TITLE,
  );
  const displayRunInfo = getBooleanValue(commonSearchParams, DISPLAY_RUN_INFO_PARAMETER, DETAULT_DISPLAY_RUN_INFO);
  const displayTimeline = getBooleanValue(commonSearchParams, DISPLAY_TIMELINE_PARAMETER, DETAULT_DISPLAY_TIMELINE);
  const displayStats = getBooleanValue(commonSearchParams, DISPLAY_STATS_PARAMETER, DETAULT_DISPLAY_STATS);
  const displayNote = getBooleanValue(commonSearchParams, DISPLAY_NOTE_PARAMETER, DETAULT_DISPLAY_NOTE);

  const compressedItemSearchParamsList = searchParams.get(IMAGE_ITEM_PARAMS_PARAMTER) || '';
  const itemParamsList: ImageItemParameters[] = [];
  for (const compressedItemSearchParams of compressedItemSearchParamsList.split(',')) {
    const itemSearchParams = new URLSearchParams(inflate(compressedItemSearchParams));

    const skin = getStringValue(itemSearchParams, SKIN_PARAMETER, '');
    const name = getStringValue(itemSearchParams, NAME_PARAMETER, '');
    const date = getStringValue(itemSearchParams, DATE_PARAMETER, '');
    const title = getStringValue(itemSearchParams, TITLE_PARAMETER, '');
    const runinfoTitle = getStringValue(itemSearchParams, RUNINFO_TITLE_PARAMETER, '');

    const note = getStringValue(itemSearchParams, NOTE_PARAMETER, '');

    const timeline = parseTimeline(itemSearchParams);

    const itemParams = {
      skin,
      name,
      date,
      title,
      timeline,
      note,
      runinfoTitle,
    };

    itemParamsList.push(itemParams);
  }

  const commonParams = {
    theme,
    pixelsPerMinute,
    width,
    detailMode,
    backgroundColor,
    textColor,
    transparent,
    useMinecraftFont,
    displayHeader,
    displayVisualTimeline,
    displayVisualTimelineTitle,
    displayRunInfo,
    displayTimeline,
    displayStats,
    displayNote,
  };

  return [commonParams, itemParamsList];
};

const toQueryString = (commonParams: ImageCommonParameters, itemParamsList: ImageItemParameters[]): string => {
  const commonSearchParams = new URLSearchParams();

  // デフォルト値は表示しない
  if (commonParams.theme !== DEFAULT_THEME) {
    commonSearchParams.set(THEME_PARAMETER, commonParams.theme);
  }
  if (commonParams.pixelsPerMinute !== DEFAULT_PIXELS_PER_MINUTE) {
    commonSearchParams.set(SCALE_PARAMETER, commonParams.pixelsPerMinute.toString());
  }
  if (commonParams.width !== DEFAULT_WIDTH) {
    commonSearchParams.set(WIDTH_PARAMETER, commonParams.width.toString());
  }
  if (commonParams.detailMode !== DEFAULT_DETAILED_MODE) {
    commonSearchParams.set(DETAILED_MODE_PARAMETER, commonParams.detailMode ? '1' : '0');
  }
  if (commonParams.backgroundColor && commonParams.backgroundColor !== `#${DEFAULT_BACKGROUND_COLOR}`) {
    commonSearchParams.set(BACKGROUND_COLOR_PARAMETER, commonParams.backgroundColor.replace(/^#/, ''));
  }
  if (commonParams.textColor && commonParams.textColor !== `#${DEFAULT_TEXT_COLOR}`) {
    commonSearchParams.set(TEXT_COLOR_PARAMETER, commonParams.textColor.replace(/^#/, ''));
  }
  if (commonParams.transparent !== DEFAULT_TRANSPARENT) {
    commonSearchParams.set(TRANSPARENT_PARAMETER, commonParams.transparent ? '1' : '0');
  }
  if (commonParams.useMinecraftFont !== DEFAULT_USE_MINECRAFT_FONT) {
    commonSearchParams.set(USE_MINECRAFT_FONT_PARAMETER, commonParams.useMinecraftFont ? '1' : '0');
  }
  if (commonParams.displayHeader !== DETAULT_DISPLAY_HEADER) {
    commonSearchParams.set(DISPLAY_HEADER_PARAMETER, commonParams.displayHeader ? '1' : '0');
  }
  if (commonParams.displayVisualTimeline !== DETAULT_DISPLAY_VISUAL_TIMELINE) {
    commonSearchParams.set(DISPLAY_VISUAL_TIMELINE_PARAMETER, commonParams.displayVisualTimeline ? '1' : '0');
  }
  if (commonParams.displayVisualTimelineTitle !== DETAULT_DISPLAY_VISUAL_TIMELINE_TITLE) {
    commonSearchParams.set(
      DISPLAY_VISUAL_TIMELINE_TITLE_PARAMETER,
      commonParams.displayVisualTimelineTitle ? '1' : '0',
    );
  }
  if (commonParams.displayRunInfo !== DETAULT_DISPLAY_RUN_INFO) {
    commonSearchParams.set(DISPLAY_RUN_INFO_PARAMETER, commonParams.displayRunInfo ? '1' : '0');
  }
  if (commonParams.displayTimeline !== DETAULT_DISPLAY_TIMELINE) {
    commonSearchParams.set(DISPLAY_TIMELINE_PARAMETER, commonParams.displayTimeline ? '1' : '0');
  }
  if (commonParams.displayStats !== DETAULT_DISPLAY_STATS) {
    commonSearchParams.set(DISPLAY_STATS_PARAMETER, commonParams.displayStats ? '1' : '0');
  }
  if (commonParams.displayNote !== DETAULT_DISPLAY_NOTE) {
    commonSearchParams.set(DISPLAY_NOTE_PARAMETER, commonParams.displayNote ? '1' : '0');
  }

  const compressedCommonSearchParams = deflate(commonSearchParams.toString());

  const compressedItemSearchParams: string[] = [];

  for (const itemParams of itemParamsList) {
    const itemSearchParams = new URLSearchParams();

    if (itemParams.skin) {
      itemSearchParams.set(SKIN_PARAMETER, itemParams.skin);
    }
    if (itemParams.name) {
      itemSearchParams.set(NAME_PARAMETER, itemParams.name);
    }
    if (itemParams.date) {
      itemSearchParams.set(DATE_PARAMETER, itemParams.date);
    }
    if (itemParams.title) {
      itemSearchParams.set(TITLE_PARAMETER, itemParams.title);
    }
    if (itemParams.note) {
      itemSearchParams.set(NOTE_PARAMETER, itemParams.note);
    }
    if (itemParams.runinfoTitle) {
      itemSearchParams.set(RUNINFO_TITLE_PARAMETER, itemParams.runinfoTitle);
    }

    if (itemParams.timeline.length > 0) {
      const timelineString = itemParams.timeline
        .map((item) => {
          const event = TIMELINE_EVENT_MAP[item.type as keyof typeof TIMELINE_EVENT_MAP] ?? item.type;
          return `${event},${item.igt}`;
        })
        .join('/');
      itemSearchParams.set(TIMELINE_PARAMETER, timelineString);
    }

    let searchParamsString = itemSearchParams.toString();
    searchParamsString = searchParamsString.replaceAll('%2C', ',');
    searchParamsString = searchParamsString.replaceAll('%2F', '/');
    searchParamsString = searchParamsString.replaceAll('%3A', ':');

    compressedItemSearchParams.push(deflate(searchParamsString));
  }

  const searchParams = new URLSearchParams();
  searchParams.set(IMAGE_COMMON_PARAMS_PARAMTER, compressedCommonSearchParams);
  searchParams.set(IMAGE_ITEM_PARAMS_PARAMTER, compressedItemSearchParams.join(','));

  return searchParams.toString();
};

export const ImageBuilderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({ theme: 'builder' });
  const [commonParams, itemParamsList] = parseBuilderParams(searchParams);
  const setting = {
    label: {
      enter_nether: 'Enter Nether',
      enter_bastion: 'Enter Bastion',
      enter_fortress: 'Enter Fortress',
      first_portal: 'First Portal',
      second_portal: 'Second Portal',
      enter_stronghold: 'Enter Stronghold',
      portal_room: 'Portal Room',
      enter_end: 'Enter End',
      credits: 'Finish',
    },
    pbTimelineTitle: '',
    paceTimelineTitle: '',
    nextItemStyle: 'hyphen',
  } as const;

  const onChangeParameters = useCallback(
    (commonParams: ImageCommonParameters, itemParamsList: ImageItemParameters[]) => {
      const searchParamsString = toQueryString(commonParams, itemParamsList);
      const url = searchParamsString ? `${location.pathname}?${searchParamsString}` : location.pathname;

      // クエリパラメータ含めて同じURLには遷移しない
      if (url === location.pathname + location.search) {
        return;
      }
      navigate(url);
    },
    [location.pathname, location.search, navigate],
  );

  return (
    <ImageBuilder
      commonParams={commonParams}
      itemParamsList={itemParamsList}
      setting={setting}
      onChange={onChangeParameters}
    />
  );
};
