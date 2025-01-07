import React from 'react';
import { styled } from 'styled-components';
import { Skin } from '../common/Skin';
import { convertMillisecondsToTime } from '../../utils/utils';

type RunInfoProps = {
  skin: string;
  name: string;
  time: number;
  date: string;
  title?: string;
};

export const RunInfo: React.FC<RunInfoProps> = ({ skin, name, time, date, title }) => {
  return (
    <Wrapper>
      <Horizontal>
        <Skin uuid={skin} scale={6} />
        <Container>
          <Name>{name}</Name>
          <Time>{title ? title : convertMillisecondsToTime(time)}</Time>
          <Date>{date}</Date>
        </Container>
      </Horizontal>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const Horizontal = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 64px;
`;
const Container = styled.div`
  display: row;
  flex-direction: column;
  @media (min-width: 1280px) {
    flex-direction: row;
  }
`;
const Name = styled.div`
  color: var(--id-text-color);
  font: normal normal 42px/1 'Minecraft-Regular', sans-serif;
`;
const Time = styled.div`
  color: var(--id-text-color);
  font: normal normal 64px/1 'Minecraft-Regular', sans-serif;
  line-height: 1;
  margin: 0.5em 0;
`;
const Date = styled.div`
  color: var(--id-text-color);
  font: normal normal 24px/1 'Minecraft-Regular', sans-serif;
  justify-self: flex-end;
`;
