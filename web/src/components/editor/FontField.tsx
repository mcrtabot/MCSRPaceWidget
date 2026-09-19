import React, { useState } from 'react';

import { Group, NumberInput, Select, Text, TextInput } from '@mantine/core';

import { FONT_FAMILIES, FONT_WEIGHTS, FontParts, buildFont, parseFont } from '../../utils/font';

type FontFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  reset: React.ReactNode;
  note: React.ReactNode;
};

const CUSTOM = '__custom__';

export const FontField = ({ label, value, onChange, reset, note }: FontFieldProps) => {
  const parts = parseFont(value);
  // Custom… を選んだことを覚えておく。値だけ見ていると、プリセットが
  // 入っている状態から自由入力に入れない
  const [custom, setCustom] = useState(false);

  // 略記として読めない値はそのまま編集させる。壊した値で編集できなくなるのを避ける
  if (!parts) {
    return (
      <div>
        <Group gap="xs" align="flex-end" wrap="nowrap">
          <TextInput style={{ flex: 1 }} label={label} value={value} onChange={(e) => onChange(e.currentTarget.value)} />
          {reset}
        </Group>
        {note}
      </div>
    );
  }

  const emit = (next: Partial<FontParts>) => onChange(buildFont({ ...parts, ...next }));

  const known = FONT_FAMILIES.find((f) => f.value === parts.family);
  const showCustom = custom || !known;
  const sizeNumber = Number.parseFloat(parts.size) || 16;
  const sizeUnit = parts.size.replace(/^[\d.]+/, '') || 'px';

  return (
    <div>
      <Group gap="xs" align="center" wrap="nowrap" mb={4}>
        <Text size="sm" style={{ flex: 1 }}>
          {label}
        </Text>
        {reset}
      </Group>

      <Select
        size="xs"
        mb={6}
        value={showCustom ? CUSTOM : known!.value}
        onChange={(v) => {
          if (!v) {
            return;
          }
          if (v === CUSTOM) {
            setCustom(true);
          } else {
            setCustom(false);
            emit({ family: v });
          }
        }}
        data={[...FONT_FAMILIES.map((f) => ({ value: f.value, label: f.label })), { value: CUSTOM, label: 'Custom…' }]}
        allowDeselect={false}
        comboboxProps={{ withinPortal: true }}
      />

      {showCustom && (
        <TextInput
          size="xs"
          mb={6}
          value={parts.family}
          placeholder="e.g. Comic Sans MS, sans-serif"
          onChange={(e) => emit({ family: e.currentTarget.value })}
        />
      )}

      <Group gap="xs" wrap="nowrap">
        <NumberInput
          size="xs"
          style={{ flex: 1 }}
          label="Size"
          value={sizeNumber}
          min={6}
          max={200}
          step={1}
          suffix={sizeUnit}
          hideControls
          onChange={(v) => typeof v === 'number' && emit({ size: `${v}${sizeUnit}` })}
        />
        <Select
          size="xs"
          style={{ flex: 1 }}
          label="Weight"
          value={FONT_WEIGHTS.some((w) => w.value === parts.weight) ? parts.weight : FONT_WEIGHTS[0].value}
          onChange={(v) => v && emit({ weight: v })}
          data={FONT_WEIGHTS}
          allowDeselect={false}
          comboboxProps={{ withinPortal: true }}
        />
        <NumberInput
          size="xs"
          w={72}
          label="Line"
          value={Number.parseFloat(parts.lineHeight) || 1}
          min={0.5}
          max={4}
          step={0.1}
          decimalScale={2}
          hideControls
          onChange={(v) => typeof v === 'number' && emit({ lineHeight: String(v) })}
        />
      </Group>
      {note}
    </div>
  );
};
