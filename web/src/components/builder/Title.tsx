import { styled } from 'styled-components';
import { SkinFace } from '../common/SkinFace';

type TitleProps = {
  skin: string;
  title: string;
  color?: string;
};
export const Title: React.FC<TitleProps> = ({ skin, title, color }) => {
  return (
    <TitleWrapper>
      {skin && <SkinFace uuid={skin} scale={4} />}
      <TitleLabel color={color}>{title}</TitleLabel>
    </TitleWrapper>
  );
};

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;

  > *:not(:first-child) {
    margin-left: 8px;
  }
`;

const TitleLabel = styled.div<{ color?: string }>`
  font: normal normal 30px/1 'Minecraft-Regular', sans-serif;
  color: ${({ color }) => (color ? color : ' var(--id-text-color)')};
  white-space: nowrap;
`;
