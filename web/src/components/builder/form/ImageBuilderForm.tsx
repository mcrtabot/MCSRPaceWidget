import { ImageCommonParameters, ImageItemParameters } from '..';
import React, { useCallback } from 'react';

import { ImageBuilderCommonParamsForm } from './ImageBuilderCommonParamsForm';
import ImageBuilderItemParamsForm from './ImageBuilderItemParamsForm';
import { createKey } from '../../../utils/utils';
import { styled } from 'styled-components';
import { parseItemParams } from '../../../utils/image-builder';
import { ImageBuilderItemParamsHeader } from './ImageBuilderItemParamsHeader';

export type ImageBuilderFormProps = {
  values: [ImageCommonParameters, ImageItemParameters[]];
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
  values,
  onChangeCommonParams,
  onChangeItemParams,
}) => {
  const [commonParams, itemParamsList] = values;

  const handleChangeCommonParams = useCallback(
    (commonParams: ImageCommonParameters) => {
      onChangeCommonParams(commonParams);
    },
    [onChangeCommonParams],
  );

  const handleChangeItemParams = useCallback(
    (itemParams: ImageItemParameters, index: number) => {
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

  const handleItemParamsAddFromURL = useCallback(
    (index: number) => {
      const input = window.prompt('Enter URL');
      if (!input) {
        return;
      }
      const newItems = parseItemParams(new URLSearchParams(input));
      if (newItems.length === 0) {
        return;
      }
      // 指定された index に新しい item を追加する
      const newItemParamsList = [...itemParamsList];
      newItemParamsList.splice(index, 0, ...newItems);
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
        return (
          <ItemContainer key={itemParams.key}>
            <ImageBuilderItemParamsHeader
              index={index}
              total={itemParamsList.length}
              itemParams={itemParams}
              handleAddItemParams={handleAddItemParams}
              handleRemoveItemParams={handleRemoveItemParams}
              handleMoveItemParams={handleMoveItemParams}
            />
            <ImageBuilderItemParamsForm index={index} values={itemParams} onChange={handleChangeItemParams} />
          </ItemContainer>
        );
      })}
      <ItemParamsHeader>
        <ActionContainer>
          <ActionButton onClick={() => handleAddItemParams(itemParamsList.length)}>+ Add</ActionButton>
          <ActionButton onClick={() => handleItemParamsAddFromURL(itemParamsList.length)}>+ Add From URL</ActionButton>
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
