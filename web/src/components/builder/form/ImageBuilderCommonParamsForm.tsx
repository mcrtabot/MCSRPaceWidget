import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ImageCommonParameters } from '..';
import styled from 'styled-components';
import {
  CheckInput,
  ColorInput,
  Description,
  Horizontal,
  Input,
  Item,
  ItemContainer,
  Label,
  Pane,
  SectionTitle,
  SubLabel,
} from '.';

export type ImageBuilderCommonParamsFormProps = {
  initialValues: ImageCommonParameters;
  onChange: (values: ImageCommonParameters) => void;
};

export const ImageBuilderCommonParamsForm: React.FC<ImageBuilderCommonParamsFormProps> = ({
  initialValues,
  onChange,
}) => {
  const { register, watch, setValue } = useForm<ImageCommonParameters>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      Object.keys(initialValues).forEach((key) => {
        setValue(key as keyof ImageCommonParameters, initialValues[key as keyof ImageCommonParameters]);
      });
    }
  }, [initialValues, setValue]);

  const watchedValues = watch();

  useEffect(() => {
    onChange(watchedValues);
  }, [watchedValues, onChange]);

  return (
    <Wrapper>
      <form>
        <Horizontal>
          <Pane>
            <SectionTitle>Common Settings</SectionTitle>

            <ItemContainer>
              <Item>
                <Label>Scale</Label>
                <ScaleInput type="number" {...register('pixelsPerMinute')} />
                <SubLabel>pixels / minute</SubLabel>
              </Item>
              <Description>If set to 0, the visual timeline size will be set automatically.</Description>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Image Width</Label>
                <ScaleInput type="number" {...register('width')} />
                <SubLabel>pixels</SubLabel>
              </Item>
              <Description>If set to 0, the image size will be set automatically.</Description>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Detailed Mode</Label>
                <CheckInput type="checkbox" {...register('detailMode')} />
              </Item>
              <Description>If checked, detailed events will also be displayed.</Description>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Text Color</Label>
                <ColorInput type="color" {...register('textColor')} />
                <SubLabel>{watchedValues.textColor}</SubLabel>
              </Item>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Background Color</Label>
                <ColorInput type="color" {...register('backgroundColor')} />
                <SubLabel>{watchedValues.backgroundColor}</SubLabel>
              </Item>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Transparent</Label>
                <CheckInput type="checkbox" {...register('transparent')} />
              </Item>
              <Description>If checked, the background of the generated image will be transparent.</Description>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Use Minecraft Font</Label>
                <CheckInput type="checkbox" {...register('useMinecraftFont')} />
              </Item>
              <Description>If checked, the Minecraft font will be used for the text.</Description>
            </ItemContainer>
          </Pane>

          <Pane>
            <SectionTitle>Component</SectionTitle>

            <ComponentItemContainer>
              <Item>
                <ComponentLabel>Header</ComponentLabel>
                <CheckInput type="checkbox" {...register('displayHeader')} />
              </Item>
            </ComponentItemContainer>
            <ComponentItemContainer>
              <Item>
                <ComponentLabel>Visual Timeline</ComponentLabel>
                <CheckInput type="checkbox" {...register('displayVisualTimeline')} />
              </Item>
            </ComponentItemContainer>
            <ComponentItemContainer>
              <Item>
                <ComponentLabel>Title in Visual Timeline</ComponentLabel>
                <CheckInput type="checkbox" {...register('displayVisualTimelineTitle')} />
              </Item>
            </ComponentItemContainer>
            <ComponentItemContainer>
              <Item>
                <ComponentLabel>Run Info</ComponentLabel>
                <CheckInput type="checkbox" {...register('displayRunInfo')} />
              </Item>
            </ComponentItemContainer>
            <ComponentItemContainer>
              <Item>
                <ComponentLabel>Timeline</ComponentLabel>
                <CheckInput type="checkbox" {...register('displayTimeline')} />
              </Item>
            </ComponentItemContainer>
            <ComponentItemContainer>
              <Item>
                <ComponentLabel>Stats</ComponentLabel>
                <CheckInput type="checkbox" {...register('displayStats')} />
              </Item>
            </ComponentItemContainer>
            <ComponentItemContainer>
              <Item>
                <ComponentLabel>Remarks</ComponentLabel>
                <CheckInput type="checkbox" {...register('displayNote')} />
              </Item>
            </ComponentItemContainer>
          </Pane>
        </Horizontal>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const ComponentItemContainer = styled.div`
  margin-bottom: 8px;
`;

const ComponentLabel = styled(Label)`
  min-width: 240px;
`;
const ScaleInput = styled(Input)`
  width: 50px;
`;
