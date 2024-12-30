import React from 'react';

export type SkinFaceProps = {
  className?: string;
  uuid: string;
  scale?: number;
};

export const SkinFace: React.FC<SkinFaceProps> = ({ className, uuid, scale = 16 }) => {
  return (
    <img
      className={className}
      style={{ display: 'inline-block' }}
      src={`https://api.mineatar.io/face/${uuid}?scale=${scale}`}
      alt=""
    />
  );
};
