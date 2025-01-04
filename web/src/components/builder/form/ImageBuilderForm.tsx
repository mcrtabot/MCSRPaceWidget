import React, { useCallback } from 'react';

import { generateTitle, ImageCommonParameters, ImageItemParameters } from '..';
import { ImageBuilderCommonParamsForm } from './ImageBuilderCommonParamsForm';
import ImageBuilderItemParamsForm from './ImageBuilderItemParamsForm';
import { styled } from 'styled-components';
import { Title } from '../Title';

export type ImageBuilderFormProps = {
  initialValues: [ImageCommonParameters, ImageItemParameters[]];
  onChange: (commonParams: ImageCommonParameters, itemParamsList: ImageItemParameters[]) => void;
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

export const ImageBuilderForm: React.FC<ImageBuilderFormProps> = ({ initialValues, onChange }) => {
  const [commonParams, itemParamsList] = initialValues;

  const handleChangeCommonParams = useCallback(
    (commonParams: ImageCommonParameters) => {
      onChange(commonParams, itemParamsList);
    },
    [onChange, itemParamsList],
  );

  const handleChangeItemParams = useCallback(
    (itemParams: ImageItemParameters, index: number) => {
      const newItemParamsList = [...itemParamsList];
      newItemParamsList[index] = itemParams;
      onChange(commonParams, newItemParamsList);
    },
    [itemParamsList, onChange, commonParams],
  );

  const handleAddItemParams = useCallback(() => {
    onChange(commonParams, [...itemParamsList, DEFAULT_IMAGE_ITEM_PARAMS]);
  }, [itemParamsList, onChange, commonParams]);

  const handleRemoveItemParams = useCallback(
    (index: number) => {
      const newItemParamsList = [...itemParamsList];
      newItemParamsList.splice(index, 1);
      onChange(commonParams, newItemParamsList);
    },
    [itemParamsList, onChange, commonParams],
  );

  const handleMoveItemParams = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newItemParamsList = [...itemParamsList];
      const [removedItem] = newItemParamsList.splice(fromIndex, 1);
      newItemParamsList.splice(toIndex, 0, removedItem);
      onChange(commonParams, newItemParamsList);
    },
    [itemParamsList, onChange, commonParams],
  );

  return (
    <>
      <ImageBuilderCommonParamsForm initialValues={commonParams} onChange={handleChangeCommonParams} />
      {itemParamsList.map((itemParams, index) => {
        const title = generateTitle(itemParams);
        return (
          <ItemContainer key={index}>
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
                <ActionButton onClick={handleAddItemParams}>+ Add</ActionButton>
                <ActionButton onClick={() => handleRemoveItemParams(index)}>× Remove</ActionButton>
              </ActionContainer>
            </ItemParamsHeader>

            <ImageBuilderItemParamsForm
              initialValues={itemParams}
              onChange={(itemParams: ImageItemParameters) => handleChangeItemParams(itemParams, index)}
            />
          </ItemContainer>
        );
      })}
      <ItemParamsHeader>
        <ActionContainer>
          <ActionButton onClick={handleAddItemParams}>+ Add</ActionButton>
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

export default ImageBuilderForm;
