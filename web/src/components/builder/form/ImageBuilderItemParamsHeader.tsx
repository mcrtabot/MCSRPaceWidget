import { ImageItemParameters, generateTitle } from '..';

import { Title } from '../Title';
import { generateSingleURL } from '../../../utils/image-builder';
import { styled } from 'styled-components';
import React from 'react';

type ImageBuilderItemParamsHeaderProps = {
  index: number;
  total: number;
  itemParams: ImageItemParameters;
  handleAddItemParams: (index: number) => void;
  handleRemoveItemParams: (index: number) => void;
  handleMoveItemParams: (fromIndex: number, toIndex: number) => void;
};

export const ImageBuilderItemParamsHeader: React.FC<ImageBuilderItemParamsHeaderProps> = ({
  index,
  total,
  itemParams,
  handleAddItemParams,
  handleMoveItemParams,
  handleRemoveItemParams,
}) => {
  const title = generateTitle(itemParams);
  const singleURL = generateSingleURL({ itemParams });
  return (
    <Wrapper>
      {total >= 2 && <TitleLabel>Item {index + 1} - </TitleLabel>}
      <Title skin={itemParams.skin} title={title} color="#333333" />
      {total >= 2 && (
        <ExternalLink href={singleURL}>
          <ExternalLinkIcon />
        </ExternalLink>
      )}
      <ActionContainer>
        <ActionButton onClick={() => handleMoveItemParams(index, index - 1)} disabled={index === 0}>
          ↑ Up
        </ActionButton>
        <ActionButton onClick={() => handleMoveItemParams(index, index + 1)} disabled={index === total - 1}>
          ↓ Down
        </ActionButton>
        <ActionButton onClick={() => handleAddItemParams(index)}>+ Add</ActionButton>
        <ActionButton onClick={() => handleRemoveItemParams(index)}>× Remove</ActionButton>
      </ActionContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  align-items: center;
  max-width: 1230px;

  @media (max-width: 960px) {
    display: block;
  }
`;
const TitleLabel = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-right: 16px;
`;
const ActionContainer = styled.div`
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 960px) {
    margin: 16px 0;
  }
`;
const ActionButton = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const ExternalLink = styled.a.attrs(() => ({ target: '_blank' }))`
  margin-left: 8px;
`;

const ExternalLinkIcon = styled.img.attrs(() => ({
  src: `${process.env.REACT_APP_PATH_PREFIX}/image/export.png`,
}))`
  display: block;
  width: 24px;
  height: 24px;
`;
