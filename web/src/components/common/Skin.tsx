import React from 'react';

export type SkinProps = {
  className?: string;
  uuid: string;
  scale?: number;
};

export const Skin: React.FC<SkinProps> = ({ className, uuid, scale = 8 }) => {
  return (
    <img
      className={className}
      style={{ display: 'inline-block' }}
      src={`https://api.mineatar.io/body/full/${uuid}?scale=${scale}`}
      alt=""
    />
  );
};
