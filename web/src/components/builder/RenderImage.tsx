import { ImageCommonParameters, ImageItemParameters, useTitle } from '.';
import { SIMPLE_MODE_TIMELINE_EVENTS, TimelineItem } from '../../types';

import { Indicator } from '../indicator/Indicator';
import { RunInfo } from './RunInfo';
import { SingleTimeline } from './SingleTimeline';
import { Stats } from '../Stats/Stats';
import { Title } from './Title';
import { convertTimeToMilliSeconds } from '../../utils/utils';
import { styled } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

type RenderImageProps = {
  commonParams: ImageCommonParameters;
  itemParams: ImageItemParameters;
  canvasPadding?: number;
};

const VISUAL_INDICATOR_GAP = 32;
export const RenderImage: React.FC<RenderImageProps> = ({ commonParams, itemParams, canvasPadding = 0 }) => {
  const {
    theme,
    pixelsPerMinute,
    width,
    detailMode,
    displayHeader,
    displayVisualTimeline,
    displayRunInfo,
    displayTimeline,
    displayStats,
    displayNote,
    displayVisualTimelineTitle,
  } = commonParams;

  const { skin, name, date, timeline: strTimeline, note } = itemParams;

  let rawTimeline = strTimeline
    .map((item) => ({ type: item.type, igt: convertTimeToMilliSeconds(item.igt) }))
    .filter((item) => item.igt !== undefined) as TimelineItem[];

  let timeline = rawTimeline;
  if (!detailMode) {
    timeline = timeline.filter((item) => SIMPLE_MODE_TIMELINE_EVENTS.includes(item.type as any));
  }
  const totalTime = useMemo(() => Math.max(...timeline.map((item) => item.igt ?? 0)), [timeline]);

  const title = useTitle(itemParams);

  const [maxIndicatorTitleWidth, setMaxIndicatorTitleWidth] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTimeout(() => {
      const elements = document.querySelectorAll('[data-search="indicator-title"]');
      let maxWidth = 0;
      elements.forEach((element) => {
        const width = (element as any).offsetWidth;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });

      if (maxWidth !== maxIndicatorTitleWidth) {
        setMaxIndicatorTitleWidth(maxWidth);
      }
    }, 100);
  });

  // Visual Indicatorの幅を
  const visualIndicatorWidth = useMemo(() => {
    if (pixelsPerMinute) {
      const maxTime = Math.max(...itemParams.timeline.map((item) => convertTimeToMilliSeconds(item.igt) ?? 0));
      return `${(maxTime / 60000) * pixelsPerMinute}px`;
    } else if (width) {
      let viWidth = width - canvasPadding * 2 - 48;
      if (displayVisualTimelineTitle) {
        viWidth -= maxIndicatorTitleWidth + VISUAL_INDICATOR_GAP;
      }
      return `${viWidth}px`;
    }
    return '1280px';
  }, [canvasPadding, displayVisualTimelineTitle, itemParams.timeline, maxIndicatorTitleWidth, pixelsPerMinute, width]);

  return (
    <Wrapper>
      {displayHeader && title && (
        <TitleContainer>
          <Title skin={skin} title={title} />
        </TitleContainer>
      )}
      {(displayRunInfo || displayTimeline || displayStats) && (
        <HorizontalContainer>
          {displayRunInfo && (
            <RunInfoContainer>
              <RunInfo skin={skin} name={name} time={totalTime} date={date} />
            </RunInfoContainer>
          )}
          {displayTimeline && (
            <TimelineContainer>
              <SectionTitle>Timeline</SectionTitle>
              <SingleTimeline />
            </TimelineContainer>
          )}
          {displayStats && (
            <StatsContainer>
              <SectionTitle>Stats</SectionTitle>
              <Stats theme={theme} timeline={rawTimeline} />
            </StatsContainer>
          )}
        </HorizontalContainer>
      )}

      {displayVisualTimeline && (
        <IndicatorContainer>
          {displayVisualTimelineTitle && (
            <IndicatorTitleWrapper style={{ width: maxIndicatorTitleWidth }}>
              <IndicatorTitleInner data-search="indicator-title">
                <Title skin={skin} title={title} />
              </IndicatorTitleInner>
            </IndicatorTitleWrapper>
          )}
          <IndicatorWrapper indicatorwidth={visualIndicatorWidth}>
            <Indicator />
          </IndicatorWrapper>
        </IndicatorContainer>
      )}
      {displayNote && note && (
        <NoteContainer>
          <SectionTitle>Note</SectionTitle>
          <Note>{note}</Note>
        </NoteContainer>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Horizontal = styled.div`
  display: flex;
  gap: 64px;
`;
const SectionTitle = styled.div`
  color: var(--id-text-color);
  font: normal normal 30px/1 'Minecraft-Regular', sans-serif;
  margin-bottom: 16px;
`;
const Note = styled.pre`
  color: var(--id-text-color);
  font: normal normal 20px/1 'Minecraft-Regular', sans-serif;
  line-height: 1.5;
  margin-bottom: 0;
`;

const TitleContainer = styled.div`
  margin-bottom: 32px;
`;
const RunInfoContainer = styled.div``;
const TimelineContainer = styled.div``;
const StatsContainer = styled.div``;
const HorizontalContainer = styled(Horizontal)`
  margin-bottom: 32px;
`;
const IndicatorContainer = styled(Horizontal)`
  margin-bottom: 32px;
  align-items: center;
  gap: ${VISUAL_INDICATOR_GAP}px;
`;
const IndicatorTitleWrapper = styled.div`
  flex-shrink: 0;
  margin-top: 16px;
  overflow: hidden;
`;
const IndicatorTitleInner = styled.div`
  flex-shrink: 0;
  display: inline-block;
`;
const IndicatorWrapper = styled.div<{ indicatorwidth: React.CSSProperties['width'] }>`
  padding: 0 32px 64px 0;

  .mcsr-indicator {
    width: ${({ indicatorwidth }) => indicatorwidth};
  }
`;
const NoteContainer = styled.div``;
