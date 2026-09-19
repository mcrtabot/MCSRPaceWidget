import React from 'react';

import { Button, ColorInput, Group, NumberInput, Slider, Switch, Text, TextInput } from '@mantine/core';

import { ThemeToken, tokenLabel } from '../../utils/cssTokens';
import { FontField } from './FontField';
import { ImageField } from './ImageField';
import { TokenSpec, getTokenSpec } from '../../utils/tokenSpecs';

type TokenFieldProps = {
  token: ThemeToken;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  /** CSSのプロパティ名を出すか。既定では隠す（読む人が限られるため） */
  showProperty?: boolean;
};

/** `24px` `-48px` `0.8s` `0` を数値と単位に分ける。`auto` のような値は数値にできない */
const parseNumeric = (value: string): { amount: number; unit: string } | null => {
  const m = /^(-?[\d.]+)(px|%|em|rem|vh|vw|s|ms|deg)?$/.exec(value.trim());
  if (!m || Number.isNaN(Number(m[1]))) {
    return null;
  }
  return { amount: Number(m[1]), unit: m[2] ?? '' };
};

/** ラベル。辞書 > テーマCSSのコメント > 変数名からの機械生成 の順 */
const labelOf = (token: ThemeToken, spec?: TokenSpec) => spec?.label ?? tokenLabel(token);

const ResetButton = ({ changed, onReset }: { changed: boolean; onReset: () => void }) => (
  // reset はコントロールの外に置く。label の中に入れると <label> と紐づいてしまい、
  // Switch ではリセットと同時にトグルも発火して値が戻らない
  <Button
    size="compact-xs"
    variant="subtle"
    onClick={onReset}
    style={{ visibility: changed ? 'visible' : 'hidden' }}
  >
    reset
  </Button>
);

const FieldNote = ({ hint, property, showProperty }: { hint?: string; property: string; showProperty?: boolean }) => {
  if (!hint && !showProperty) {
    return null;
  }
  return (
    <Text size="xs" c="dimmed" mt={2}>
      {hint}
      {hint && showProperty && ' · '}
      {showProperty && <code>{property}</code>}
    </Text>
  );
};

export const TokenField = ({ token, value, onChange, showProperty = false }: TokenFieldProps) => {
  const spec = getTokenSpec(token.property);
  const current = value ?? token.value;
  const changed = value !== undefined;
  const label = labelOf(token, spec);
  const reset = <ResetButton changed={changed} onReset={() => onChange(undefined)} />;
  const note = <FieldNote hint={spec?.hint} property={token.property} showProperty={showProperty} />;

  if (token.type === 'toggle') {
    // 「表示する」= テーマCSSの var() の第2引数、「隠す」= none
    const shown = token.shownValue ?? 'block';
    return (
      <div>
        <Group gap="xs" align="center" wrap="nowrap">
          <Switch
            style={{ flex: 1 }}
            label={label}
            checked={current !== 'none'}
            onChange={(e) => onChange(e.currentTarget.checked ? shown : 'none')}
          />
          {reset}
        </Group>
        {note}
      </div>
    );
  }

  if (token.type === 'color') {
    return (
      <div>
        <Group gap="xs" align="flex-end" wrap="nowrap">
          <ColorInput style={{ flex: 1 }} label={label} format="rgba" value={current} onChange={onChange} />
          {reset}
        </Group>
        {note}
      </div>
    );
  }

  if (token.type === 'image') {
    return (
      <ImageField
        label={label}
        value={current}
        defaultValue={token.value}
        onChange={onChange}
        reset={reset}
        note={note}
      />
    );
  }

  if (spec?.input === 'font') {
    return <FontField label={label} value={current} onChange={onChange} reset={reset} note={note} />;
  }

  // 数値で入れられる項目はスライダーにする。`24px` を手で打たせない
  const numeric = spec?.input === 'slider' || spec?.input === 'duration' ? parseNumeric(current) : null;
  if (numeric) {
    const unit = numeric.unit || (spec?.input === 'duration' ? 's' : 'px');
    // % は辞書の範囲(px前提)ではなく 0..100 で扱う。同じ項目が px でも % でも
    // 指定できるため、単位を見て決める
    const percent = unit === '%';
    const min = percent ? 0 : spec?.min;
    const max = percent ? 100 : spec?.max;
    const step = percent ? 1 : spec?.step;
    const emit = (amount: number) => onChange(`${Number(amount.toFixed(3))}${unit}`);
    return (
      <div>
        <Group gap="xs" align="center" wrap="nowrap" mb={2}>
          <Text size="sm" style={{ flex: 1 }}>
            {label}
          </Text>
          <NumberInput
            size="xs"
            w={88}
            value={numeric.amount}
            onChange={(v) => typeof v === 'number' && emit(v)}
            min={min}
            max={max}
            step={step}
            suffix={unit}
            hideControls
          />
          {reset}
        </Group>
        <Slider
          size="sm"
          value={numeric.amount}
          onChange={emit}
          min={min ?? 0}
          max={max ?? 100}
          step={step ?? 1}
          label={(v) => `${v}${unit}`}
        />
        {note}
      </div>
    );
  }

  return (
    <div>
      <Group gap="xs" align="flex-end" wrap="nowrap">
        <TextInput
          style={{ flex: 1 }}
          label={label}
          value={current}
          placeholder={token.value}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
        {reset}
      </Group>
      {note}
    </div>
  );
};

/** グループ分け・並べ替えのために外からも辞書を引けるようにしておく */
export const tokenDisplayLabel = (token: ThemeToken) => labelOf(token, getTokenSpec(token.property));
export const isAdvancedToken = (token: ThemeToken) => getTokenSpec(token.property)?.advanced === true;
