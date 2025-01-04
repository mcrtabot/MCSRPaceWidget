import { Description, Horizontal, Input, Item, ItemContainer, Label, Pane, SectionTitle } from '.';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { ImageItemParameters } from '..';
import { TimelineEvent } from '../../../types';
import styled from 'styled-components';

export type ImageBuilderItemParamsFormProps = {
  initialValues: ImageItemParameters;
  onChange: (values: ImageItemParameters) => void;
};

export const ImageBuilderItemParamsForm: React.FC<ImageBuilderItemParamsFormProps> = ({ initialValues, onChange }) => {
  const { register, control, watch, setValue } = useForm<ImageItemParameters>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      Object.keys(initialValues).forEach((key) => {
        setValue(key as keyof ImageItemParameters, initialValues[key as keyof ImageItemParameters]);
      });
    }
  }, [initialValues, setValue]);

  const watchedValues = watch();

  useEffect(() => {
    onChange(watchedValues);
  }, [watchedValues, onChange]);

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'timeline',
  });

  const timelineTypeOptions: { value: TimelineEvent | ''; label: string }[] = [
    { value: '', label: 'Select Event...' },
    { value: '', label: '----------------------------------' },
    { value: 'enter_nether', label: 'Enter Nether' },
    { value: 'enter_bastion', label: 'Enter Bastion' },
    { value: 'enter_fortress', label: 'Enter Fortress' },
    { value: 'first_portal', label: 'First Portal' },
    { value: 'enter_stronghold', label: 'Enter Stronghold' },
    { value: 'portal_room', label: 'Portal Room' },
    { value: 'enter_end', label: 'Enter End' },
    { value: 'credits', label: 'Finish' },
    { value: '', label: '-- Detailed Mode Event -------------' },
    { value: 'leave_bastion', label: 'Leave Bastion' },
    { value: 'leave_fortress', label: 'Leave Fortress' },
    { value: 'second_portal', label: 'Second Portal' },
    { value: 'enter_nether2', label: 'Enter Nether (without icon)' },
    { value: 'enter_bastion2', label: 'Enter Bastion (without icon)' },
    { value: 'enter_fortress2', label: 'Enter Fortress (without icon)' },
  ];

  return (
    <Wrapper>
      <form>
        <Horizontal>
          <Pane>
            <SectionTitle>Settings</SectionTitle>

            <ItemContainer>
              <Item>
                <Label>Skin</Label>
                <Input {...register('skin')} />
              </Item>
              <Description>
                UUID of the Minecraft player.
                <br />
                You can search for the player on{' '}
                <a href="https://mineatar.io/" target="_blank" rel="noreferrer">
                  Mineatar
                </a>{' '}
                and copy the UUID.
              </Description>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Name</Label>
                <Input {...register('name')} />
              </Item>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Date</Label>
                <Input {...register('date')} />
              </Item>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Custom Title</Label>
                <Input {...register('title')} />
              </Item>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Run Info Title</Label>
                <Input {...register('runinfoTitle')} />
              </Item>
            </ItemContainer>

            <ItemContainer>
              <Item>
                <Label>Note</Label>
              </Item>
              <NoteInput {...register('note')} />
            </ItemContainer>
          </Pane>
          <Pane>
            <SectionTitle>Timeline</SectionTitle>
            {fields.map((item, index) => (
              <TimelineItem key={`${index}_${item.type}`}>
                <select {...register(`timeline.${index}.type`)} defaultValue={item.type}>
                  {timelineTypeOptions.map((option, index2) => (
                    <option key={`${option.value}_${index2}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <IGTInput
                  type="input"
                  placeholder="IGT"
                  {...register(`timeline.${index}.igt`)}
                  defaultValue={item.igt}
                />

                <button type="button" onClick={() => insert(index, { type: '', igt: '' })}>
                  +
                </button>

                <button type="button" onClick={() => remove(index)}>
                  -
                </button>
              </TimelineItem>
            ))}

            <TimelineItem>
              <button type="button" onClick={() => append({ type: '', igt: '' })}>
                {'+'}
              </button>
            </TimelineItem>
          </Pane>
        </Horizontal>
      </form>
    </Wrapper>
  );
};

export default ImageBuilderItemParamsForm;

const Wrapper = styled.div``;

const TimelineItem = styled.div`
  margin-top: 8px;

  > * {
    margin-right: 8px;
  }
`;

const IGTInput = styled(Input)`
  width: 100px;
`;

const NoteInput = styled.textarea`
  width: 100%;
  min-height: 120px;
`;
