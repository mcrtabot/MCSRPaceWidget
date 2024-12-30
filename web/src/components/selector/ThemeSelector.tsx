import React, { useCallback } from 'react';

import { Theme } from '../../types';
import { Time } from '../common/Time';
import styled from 'styled-components';
import { useThemes } from '../../hooks';

type ThemeSelectorProps = {
  type: 'timeline' | 'indicator';
  theme: string;
  onChangeTheme: (theme: string) => void;
};

const copyText = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    console.error('copy url error');
  }
};

export const ThemeSelector = ({ type, theme, onChangeTheme }: ThemeSelectorProps) => {
  const { data: themes = [] } = useThemes();

  const baseURL = window.location.origin + `/${type}?theme=${theme}`;

  const handleChangeTheme = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChangeTheme(e.target.value);
    },
    [onChangeTheme],
  );

  return (
    <Wrapper>
      <Item>
        <ItemLabel>Theme</ItemLabel>
        <Select value={theme} onChange={handleChangeTheme} style={{ width: 360 }}>
          {themes
            .filter((item) => item[type])
            .map((theme: Theme) => {
              return (
                <option key={theme.name} value={theme.name}>
                  {theme.name}
                </option>
              );
            })}
        </Select>
      </Item>
      <Item>
        <ItemLabel>URL</ItemLabel>
        <UrlText>
          {baseURL}
          <span style={{ color: 'red' }}>&demo=1</span>
        </UrlText>
        <CopyButton onClick={() => copyText(baseURL + '&demo=1')}>copy url</CopyButton>
      </Item>
      <Item>
        <ItemLabel></ItemLabel>
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          * "&demo=1" is a parameter for display in demo data. After checking and adjusting the display with demo data,
          delete "&demo=1" from the URL to be set.
        </div>
      </Item>
    </Wrapper>
  );
};

type ThemeSelectorConditionProps = {
  igt: number;
  onChangeIGT: (pos: number) => void;
  bgColor: string;
  onChangeBgColor: (bgColor: string) => void;
  dataType: 'demo' | 'actual';
  onChangeDataType: (dataTyper: 'demo' | 'actual') => void;
};

export const ThemeSelectorCondition = ({
  igt,
  onChangeIGT,
  bgColor,
  onChangeBgColor,
  dataType,
  onChangeDataType,
}: ThemeSelectorConditionProps) => {
  const handleChangeIGT = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeIGT(parseInt(e.target.value));
    },
    [onChangeIGT],
  );
  const handleChangeBgColor = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeBgColor(e.target.value);
    },
    [onChangeBgColor],
  );
  const handleChangeDataType = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeDataType(e.target.value as any);
    },
    [onChangeDataType],
  );
  return (
    <Wrapper>
      <Item>
        <ItemLabel>Background</ItemLabel>
        <input type="color" value={bgColor} onChange={handleChangeBgColor} />
      </Item>
      <Item>
        <ItemLabel>Data Source</ItemLabel>
        <Radio value="demo" id="data-demo" checked={dataType === 'demo'} onChange={handleChangeDataType} />
        <RadioLabel htmlFor="data-demo">demo data</RadioLabel>
      </Item>
      <Item>
        <ItemLabel></ItemLabel>
        <Radio value="actual" id="data-actual" checked={dataType === 'actual'} onChange={handleChangeDataType} />
        <RadioLabel htmlFor="data-actual">actual data (use actual timeline data and pb data from pb.json)</RadioLabel>
      </Item>
      <Item>
        {dataType === 'demo' && (
          <>
            <ItemLabel>InGame Time</ItemLabel>
            <Time value={igt * 1000} />
            <Range value={igt} onChange={handleChangeIGT} min={0} max={1500} />
          </>
        )}
      </Item>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px;
  font: normal normal 18px / 1 sans-serif;
`;

const Item = styled.div`
  min-height: 48px;
  display: flex;
  align-items: center;
`;

const ItemLabel = styled.span`
  display: inline-block;
  min-width: 160px;
  font-weight: bold;
`;

const Select = styled.select`
  height: 32px;
`;

const UrlText = styled.div`
  font-size: 16px;
  padding-left: 4px;
  min-width: 640px;
  min-height: 32px;
  border: 1px solid black;
  line-height: 32px;
  cursor: text;

  @media (prefers-color-scheme: dark) {
    border-color: #999;
  }
`;

const CopyButton = styled.button`
  display: inline-block;
  width: 120px;
  min-height: 32px;
`;

const Range = styled.input.attrs(() => ({ type: 'range' }))`
  width: 480px;
  margin-left: 16px;
`;

const Radio = styled.input.attrs(() => ({ type: 'radio' }))`
  margin-left: 16px;
`;
const RadioLabel = styled.label`
  margin-left: 8px;
`;
