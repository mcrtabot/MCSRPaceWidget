import React, { useCallback, useState } from 'react';

import { usePBTimeline, useSetting, useTimeline } from '../hooks';
import { useSearchParams } from 'react-router-dom';
import { ThemeSelectorCondition, ThemeSelector } from '../components/ThemeSelector';
import { Timelines } from '../components/Timelines';
import { Indicator } from '../components/Indicator';
import styled from 'styled-components';
import { AppContext } from '../context';

export const TopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams({ timeline: 'default', indicator: 'default', data: 'demo' });
  const timelineTheme = searchParams.get('timeline') || 'default';
  const indicatorTheme = searchParams.get('indicator') || 'default';
  const dataType = (searchParams.get('data') || 'demo') as 'demo' | 'actual';

  const [igt, setIGT] = useState(1200);
  const [bgColor, setBgColor] = useState('#333');

  const changeTheme = useCallback(
    (type: 'timeline' | 'indicator', theme: string) => {
      setSearchParams((prev) => {
        prev.set(type, theme);
        return prev;
      });
    },
    [setSearchParams],
  );

  const changeIGT = useCallback((igt: number) => {
    setIGT(igt);
  }, []);

  const changeDataType = useCallback(
    (dataType: 'demo' | 'actual') => {
      setSearchParams((prev) => {
        prev.set('data', dataType);
        return prev;
      });
    },
    [setSearchParams],
  );

  const {
    isLoading: isLoadingTimeline,
    data: timeline,
    hasError: hasErrorTimeline,
  } = useTimeline(dataType === 'demo', igt);
  const {
    isLoading: isLoadingPBTimeline,
    data: pbTimeline,
    hasError: hasErrorPBTimeline,
  } = usePBTimeline(dataType === 'demo');
  const { isLoading: isLoadingSetting, setting, hasError: hasErrorSetting } = useSetting(timelineTheme, true);

  if (isLoadingTimeline || isLoadingPBTimeline || isLoadingSetting) {
    return <></>;
  }

  if (hasErrorTimeline || !timeline || hasErrorSetting || !setting || hasErrorPBTimeline || !pbTimeline) {
    return (
      <div className="warning-container">
        {(hasErrorSetting || !setting) && (
          <div className="warning">
            file:theme/{timelineTheme}/setting.json does not exist or is in an invalid data format.
          </div>
        )}
      </div>
    );
  }

  return (
    <Wrapper>
      <Title>
        MCSR (Minecraft Speedrun) Pace Widget
        <CodeLink>
          <a href="https://github.com/mcrtabot/MCSRPaceWidget" target="_blank" rel="noreferrer">
            {'</>'} Github
          </a>
        </CodeLink>
      </Title>
      <DescriptionContainer>
        <ControlContainer>
          <h2>How to use</h2>
          <Description>
            <Ol>
              <Li>Edit your personal best data</Li>
              <Li>Select theme from drop down box.</Li>
              <Li>Copy widget url.</Li>
              <Li>Use widget. (e.g., in the OBS browser source) </Li>
            </Ol>
            *{' '}
            <a href="https://fontmeme.com/jfont/minecraft-font/" target="_blank" rel="noreferrer">
              Minecraft fonts
            </a>{' '}
            can be used for a more Minecraft-like look.
            <div style={{ color: 'red', fontWeight: 'bold' }}>
              * For realtime update, set "Auto Save Interval" ( in SpeedRunIGT Option &gt; Timer) to "Ticks" !
            </div>
          </Description>
          <h2>How to customize themes</h2>
          <Description>
            You can freely customize the look and feel of almost everything. (A little bit of style sheet knowledge is
            required)
            <Ol>
              <Li>Copy base theme (ex. default) and rename in "theme" directory</Li>
              <Li>
                Edit "setting.json" and stylecsheet ("timeline.css" for Timeline and "indicator.css" for Indicator)
              </Li>
            </Ol>
          </Description>
        </ControlContainer>
        <ControlContainer>
          <h2>Options (for this page only)</h2>
          <ThemeSelectorCondition
            igt={igt}
            onChangeIGT={changeIGT}
            bgColor={bgColor}
            onChangeBgColor={setBgColor}
            dataType={dataType}
            onChangeDataType={changeDataType}
          />
        </ControlContainer>{' '}
      </DescriptionContainer>
      <hr />
      <WidgetTypeContainer>
        <h2>Timeline Theme</h2>
        <ControlContainer>
          <ThemeSelector
            type="timeline"
            theme={timelineTheme}
            onChangeTheme={(theme: string) => changeTheme('timeline', theme)}
          />
        </ControlContainer>
        <WidgetContainer style={{ background: bgColor }}>
          <AppContext.Provider value={{ timeline, pbTimeline, theme: timelineTheme, setting }}>
            <Timelines />
          </AppContext.Provider>
        </WidgetContainer>
      </WidgetTypeContainer>
      <hr />
      <WidgetTypeContainer>
        <h2>Indicator Theme</h2>
        <ControlContainer>
          <ThemeSelector
            type="indicator"
            theme={indicatorTheme}
            onChangeTheme={(theme: string) => changeTheme('indicator', theme)}
          />
        </ControlContainer>
        <WidgetContainer style={{ background: bgColor }}>
          <AppContext.Provider value={{ timeline, pbTimeline, theme: indicatorTheme, setting }}>
            <Indicator />
          </AppContext.Provider>
        </WidgetContainer>
      </WidgetTypeContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  color: #000;
  font: normal normal 18px / 1 Arial, Helvetica, sans-serif;
  padding: 32px;

  @media (prefers-color-scheme: dark) {
    background-color: #111;
    color: #fff;
  }
`;

const Title = styled.h1`
  font-family: Minecraft, Arial, Helvetica, sans-serif;
`;

const CodeLink = styled.span`
  display: inline-block;
  margin-left: 32px;
  font-size: 0.6em;
`;

const DescriptionContainer = styled.div`
  padding: 32px 32px 16px;
  display: flex;

  @media screen and (max-width: 1500px) {
    display: block;
  }
`;
const ControlContainer = styled.div`
  padding: 32px 32px 16px;
`;

const Description = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  line-height: 1.5;
`;

const Ol = styled.ol`
  margin: 16px;
`;
const Li = styled.li`
  min-height: 32px;
  list-style: decimal;
  margin-left: 16px;
`;

const WidgetTypeContainer = styled.div`
  padding: 32px;
`;
const WidgetContainer = styled.div`
  position: relative;
  padding: 32px;
  min-height: 240px;
`;
