import { ImageCommonParameters, ImageItemParameters, generateTitle } from '.';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SIMPLE_MODE_TIMELINE_EVENTS, Setting, TimelineItem } from '../../types';

import { AppContext } from '../../context';
import { ImageBuilderForm } from './form/ImageBuilderForm';
import { RenderImage } from './RenderImage';
import { convertTimeToMilliSeconds } from '../../utils/utils';
import { domToPng } from 'modern-screenshot';
import { styled } from 'styled-components';
import { Helmet } from 'react-helmet-async';

type ImageBuilderProps = {
  commonParams: ImageCommonParameters;
  itemParamsList: ImageItemParameters[];
  setting: Setting;
  onChangeCommonParams: (commonParams: ImageCommonParameters) => void;
  onChangeItemParams: (itemParamsList: ImageItemParameters[]) => void;
};

const exampleUrl =
  'https://mcrtabot.github.io/MCSRImageBuilder/?c=K05WNXYxUDUyKwfShkYWIGZKLogNAA%3D%3D&i=NY7BboMwEES_xkdH3rUx5giJ6CntoV9gG9OgOIDAqGq_vrupIvngtzM7O7vQl2aMlTfeytrWIE0alPTeOYkpOEg-JhWDQDuT9RG34sNSCAdCVGgkgISG9UKTz9u0fm8p3gWeBXbdNg1f6f9_WY6QEw_zNA8CK9XeSll3oVuBPb2f5SjHKZClb6_3j9_3Lsu3KyWXTMlpphgks1FkSNTobIj4dJ-ZaiKNrI1EDTst0bgSARAq9xTxxZXhVTYDJynN8v5CzcuJu0NFiM8s7gCWd5sTOPUH';
export const CANVAS_PADDING = 48;
export const ImageBuilder = ({
  commonParams,
  itemParamsList,
  setting,
  onChangeCommonParams,
  onChangeItemParams,
}: ImageBuilderProps) => {
  const { theme, pixelsPerMinute, width, detailMode, backgroundColor, textColor, transparent, useMinecraftFont } =
    commonParams;

  // マイクラフォントを利用するかどうか
  useLayoutEffect(() => {
    if (!useMinecraftFont) {
      return;
    }

    const head = document.head;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `${process.env.REACT_APP_PATH_PREFIX}/theme/${theme}/mcfont.css`;

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, [theme, useMinecraftFont]);

  // 画像生成関連の処理
  const componentRef = useRef(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const generateImage = () => {
    if (componentRef.current) {
      domToPng(componentRef.current)
        .then((dataUrl: string) => {
          setImageSrc(dataUrl);
        })
        .catch((error: any) => {
          console.error('Error taking screenshot', error);
        });
    }
  };
  const updateImage = useCallback(() => generateImage(), []);

  useEffect(() => {
    setTimeout(() => {
      generateImage();
    }, 100);
  }, [commonParams, itemParamsList]);

  let pageTitle = '';
  if (itemParamsList.length > 0) {
    pageTitle = generateTitle(itemParamsList[0]);
  }

  const handleSaveAsImage = useCallback(() => {
    if (imageSrc) {
      const link = document.createElement('a');
      link.href = imageSrc;
      link.download = pageTitle ? `${pageTitle}.png` : 'mcsr_run.png';
      link.click();
    }
  }, [imageSrc, pageTitle]);

  const maxTime = useMemo(
    () =>
      Math.max(
        ...itemParamsList
          .map((itemParams) => itemParams.timeline.map((item) => convertTimeToMilliSeconds(item.igt) ?? 0))
          .flat(),
      ),
    [itemParamsList],
  );
  const backgroundStyle = {
    background: backgroundColor,
  } as any;

  const canvasStyle = {
    '--id-background': transparent ? 'transparent' : backgroundColor,
    '--id-text-color': textColor,
    '--tl-text-color': textColor,
    '--st-text-color': textColor,
    borderBottomColor: transparent ? 'transparent' : backgroundColor,
  } as any;
  if (pixelsPerMinute) {
    canvasStyle['width'] = 'fit-content';
  } else if (width) {
    canvasStyle['width'] = width - CANVAS_PADDING * 2;
  } else {
    canvasStyle['width'] = 'fit-content';
  }

  const isRealtimeImageRender = false;

  return (
    <Wrapper>
      <Helmet>
        <title>{pageTitle} - MCSR Image Builder</title>
      </Helmet>
      <CanvasContainer display={isRealtimeImageRender ? '0' : '1'}>
        <ComponentCanvasWrapper style={{ backgroundColor }}>
          <ComponentCanvas ref={componentRef} style={{ ...canvasStyle }}>
            {itemParamsList.map((itemParams, index) => {
              const { timeline: strTimeline } = itemParams;
              let rawTimeline = strTimeline
                .map((item) => ({ type: item.type, igt: convertTimeToMilliSeconds(item.igt) }))
                .filter((item) => item.igt !== undefined) as TimelineItem[];

              let timeline = rawTimeline;
              if (!detailMode) {
                timeline = timeline.filter((item) => SIMPLE_MODE_TIMELINE_EVENTS.includes(item.type as any));
              }

              return (
                <AppContext.Provider
                  key={itemParams.key}
                  value={{
                    timeline: { timelines: timeline, igt: maxTime },
                    pbTimeline: timeline,
                    theme,
                    setting,
                    pixelsPerMinute,
                    detailMode,
                  }}
                >
                  <RenderImage
                    index={index}
                    commonParams={commonParams}
                    itemParams={itemParams}
                    canvasPadding={CANVAS_PADDING}
                    updateForce={updateImage}
                  />
                </AppContext.Provider>
              );
            })}
          </ComponentCanvas>
        </ComponentCanvasWrapper>
      </CanvasContainer>
      {isRealtimeImageRender && (
        <Background style={{ ...backgroundStyle, width: 'fit-content' }}>
          {imageSrc && <RenderedImage src={imageSrc} alt="Screenshot" />}
        </Background>
      )}
      <SaveButton onClick={handleSaveAsImage}>Download Image</SaveButton>
      <a href={exampleUrl} target="_blank" rel="noreferrer">
        Input example
      </a>
      <ImageBuilderForm
        initialValues={[commonParams, itemParamsList]}
        onChangeCommonParams={onChangeCommonParams}
        onChangeItemParams={onChangeItemParams}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: 'Roboto', sans-serif;
`;

const CanvasContainer = styled.div<{ display: '1' | '0' }>`
  position: ${({ display }) => (display === '1' ? 'relative' : 'absolute')};
  top: 0;
  left: 0;
  width: ${({ display }) => (display === '1' ? 'auto' : 0)};
  height: ${({ display }) => (display === '1' ? 'auto' : 0)};
  overflow: hidden;
  margin-top: ${({ display }) => (display === '1' ? '-8px' : 0)};
  margin-left: ${({ display }) => (display === '1' ? '-8px' : 0)};
  margin-bottom: ${({ display }) => (display === '1' ? '16px' : 0)};
`;

const Background = styled.div`
  margin-left: -8px;
  margin-right: -8px;
  margin-top: -8px;
  margin-bottom: 16px;
`;

const ComponentCanvasWrapper = styled.div`
  width: fit-content;
  padding-bottom: 2px;
`;
const ComponentCanvas = styled.div`
  background: var(--id-background);
  border: none;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  padding: ${CANVAS_PADDING}px;

  > *:not(:first-child) {
    margin-top: 48px;
  }
`;

const RenderedImage = styled.img`
  display: block;

  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

const SaveButton = styled.button`
  font-size: 18px;
  margin: 8px 16px;
  padding: 8px 16px;
`;
