import { ImageCommonParameters, ImageItemParameters, generateTitle } from '..';
import React, { useCallback } from 'react';

import { ImageBuilderCommonParamsForm } from './ImageBuilderCommonParamsForm';
import ImageBuilderItemParamsForm from './ImageBuilderItemParamsForm';
import { Title } from '../Title';
import { createKey } from '../../../utils/utils';
import { styled } from 'styled-components';

export type ImageBuilderFormProps = {
  initialValues: [ImageCommonParameters, ImageItemParameters[]];
  onChangeCommonParams: (commonParams: ImageCommonParameters) => void;
  onChangeItemParams: (itemParamsList: ImageItemParameters[]) => void;
};

const DEFAULT_IMAGE_ITEM_PARAMS: ImageItemParameters = {
  skin: '',
  name: '',
  date: '',
  title: '',
  timeline: [],
  note: '',
  runinfoTitle: '',
};

export const ImageBuilderForm: React.FC<ImageBuilderFormProps> = ({
  initialValues,
  onChangeCommonParams,
  onChangeItemParams,
}) => {
  const [commonParams, itemParamsList] = initialValues;

  const handleChangeCommonParams = useCallback(
    (commonParams: ImageCommonParameters) => {
      onChangeCommonParams(commonParams);
    },
    [onChangeCommonParams],
  );

  const handleChangeItemParams = useCallback(
    (itemParams: ImageItemParameters, index: number) => {
      console.log('handleChangeItemParams', index, itemParams);
      const newItemParamsList = [...itemParamsList];
      newItemParamsList[index] = itemParams;
      onChangeItemParams(newItemParamsList);
    },
    [itemParamsList, onChangeItemParams],
  );

  const handleAddItemParams = useCallback(
    (index: number) => {
      // 指定された index に新しい item を追加する
      const newItem = { key: createKey(), ...DEFAULT_IMAGE_ITEM_PARAMS };
      const newItemParamsList = [...itemParamsList];
      newItemParamsList.splice(index, 0, newItem);
      onChangeItemParams(newItemParamsList);
    },
    [itemParamsList, onChangeItemParams],
  );

  const handleRemoveItemParams = useCallback(
    (index: number) => {
      const newItemParamsList = [...itemParamsList];
      newItemParamsList.splice(index, 1);
      onChangeItemParams(newItemParamsList);
    },
    [itemParamsList, onChangeItemParams],
  );

  const handleMoveItemParams = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newItemParamsList = [...itemParamsList];
      const [removedItem] = newItemParamsList.splice(fromIndex, 1);
      newItemParamsList.splice(toIndex, 0, removedItem);
      onChangeItemParams(newItemParamsList);
    },
    [itemParamsList, onChangeItemParams],
  );

  return (
    <>
      <ImageBuilderCommonParamsForm values={commonParams} onChange={handleChangeCommonParams} />
      {itemParamsList.map((itemParams, index) => {
        const title = generateTitle(itemParams);
        return (
          <ItemContainer key={`${index}_${title}`}>
            <ItemParamsHeader>
              {itemParamsList.length >= 2 && <TitleLabel>Item {index + 1} - </TitleLabel>}
              <Title skin={itemParams.skin} title={title} color="#333333" />
              <ActionContainer>
                <ActionButton onClick={() => handleMoveItemParams(index, index - 1)} disabled={index === 0}>
                  ↑ Up
                </ActionButton>
                <ActionButton
                  onClick={() => handleMoveItemParams(index, index + 1)}
                  disabled={index === itemParamsList.length - 1}
                >
                  ↓ Down
                </ActionButton>
                <ActionButton onClick={() => handleAddItemParams(index)}>+ Add</ActionButton>
                <ActionButton onClick={() => handleRemoveItemParams(index)}>× Remove</ActionButton>
              </ActionContainer>
            </ItemParamsHeader>

            <ImageBuilderItemParamsForm
              values={itemParams}
              onChange={(itemParams: ImageItemParameters) => handleChangeItemParams(itemParams, index)}
            />
          </ItemContainer>
        );
      })}
      <ItemParamsHeader>
        <ActionContainer>
          <ActionButton onClick={() => handleAddItemParams(itemParamsList.length)}>+ Add</ActionButton>
        </ActionContainer>
      </ItemParamsHeader>
    </>
  );
};

const ItemContainer = styled.div`
  margin-bottom: 16px;
`;

const ItemParamsHeader = styled.div`
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
