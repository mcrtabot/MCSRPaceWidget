import { styled } from 'styled-components';

export const Vertical = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Horizontal = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1280px) {
    flex-direction: row;
  }
`;

export const Pane = styled.div`
  font-size: 16px;
  color: #333;

  @media (min-width: 960px) {
    min-width: 534px;
    margin: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 32px;
  }

  @media (max-width: 960px) {
    width: calc(100%-32px);
    padding: 16px;
    border-top: 1px solid #ccc;
  }
`;
export const SectionTitle = styled.h3`
  margin-top: 16px;
  margin-bottom: 32px;
  font-size: 20px;
`;

export const ItemContainer = styled.div`
  margin-bottom: 16px;
`;
export const Item = styled.div`
  display: flex;
  align-items: center;
`;
export const Label = styled.label`
  display: inline-block;
  min-width: 180px;
  font-weight: bold;
`;
export const SubLabel = styled.label`
  display: inline-block;
  min-width: 180px;
  color: #666;
  font-size: 0.9em;
  margin-left: 8px;
`;

export const Description = styled.label`
  display: inline-block;
  min-width: 180px;
  color: #666;
  margin-top: 8px;
  font-size: 0.9em;
  padding-left: 8px;
`;

export const Input = styled.input`
  width: 320px;
  margin-right: 8px;
`;

export const ColorInput = styled.input`
  margin-right: 16px;
`;

export const CheckInput = styled.input`
  margin-right: 50px;
  width: 25px;
  height: 25px;

  cursor: pointer;
`;
