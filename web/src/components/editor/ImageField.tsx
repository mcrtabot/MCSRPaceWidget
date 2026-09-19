import React, { useRef, useState } from 'react';

import { Button, Group, Text, TextInput } from '@mantine/core';

import { skinFaceUrl, usePlayer, useUploads } from '../../hooks';
import { buildImageUrl, parseImageUrl } from '../../utils/image';

type ImageFieldProps = {
  label: string;
  /** `url(...)` 形式のトークン値 */
  value: string;
  /** テーマが元々指している画像。選択肢の先頭に出す */
  defaultValue: string;
  onChange: (value: string) => void;
  reset: React.ReactNode;
  note: React.ReactNode;
};

const Thumb = ({ url, selected, title, onClick }: { url: string; selected: boolean; title: string; onClick: () => void }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    style={{
      width: 44,
      height: 44,
      padding: 0,
      borderRadius: 6,
      cursor: 'pointer',
      background: `var(--e-surface-sunken) center/contain no-repeat url(${url})`,
      imageRendering: 'pixelated',
      border: selected ? '2px solid var(--e-accent)' : '1px solid var(--e-border-strong)',
    }}
  />
);

export const ImageField = ({ label, value, defaultValue, onChange, reset, note }: ImageFieldProps) => {
  const current = parseImageUrl(value);
  const { uploads, upload } = useUploads();
  const player = usePlayer();
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const choices: { url: string; title: string }[] = [];
  const defaultUrl = parseImageUrl(defaultValue);
  if (defaultUrl && defaultUrl !== 'none') {
    choices.push({ url: defaultUrl, title: "The theme's own image" });
  }
  if (player) {
    choices.push({ url: skinFaceUrl(player.id), title: `Your skin (${player.id})` });
  }
  uploads.forEach((name) => choices.push({ url: `/upload/${name}`, title: name }));

  const pick = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      onChange(buildImageUrl(await upload(file)));
    } catch (e) {
      // 失敗の理由はサーバー側にしか無いので、ここでは一般的な案内にとどめる
      setError('Could not add that image. PNG, JPEG, GIF or WebP up to 2MB.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Group gap="xs" align="center" wrap="nowrap" mb={6}>
        <Text size="sm" style={{ flex: 1 }}>
          {label}
        </Text>
        {reset}
      </Group>

      <Group gap={6} mb={6}>
        {choices.map((c) => (
          <Thumb
            key={c.url}
            url={c.url}
            title={c.title}
            selected={current === c.url}
            onClick={() => onChange(buildImageUrl(c.url))}
          />
        ))}
        <Button
          size="compact-sm"
          variant="default"
          h={44}
          loading={busy}
          onClick={() => fileInput.current?.click()}
        >
          + Add
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          hidden
          onChange={(e) => {
            pick(e.currentTarget.files?.[0]);
            e.currentTarget.value = '';
          }}
        />
      </Group>

      <TextInput
        size="xs"
        value={current}
        placeholder="or paste an image URL"
        onChange={(e) => onChange(buildImageUrl(e.currentTarget.value))}
      />
      {error && (
        <Text size="xs" c="red" mt={4}>
          {error}
        </Text>
      )}
      {note}
    </div>
  );
};
