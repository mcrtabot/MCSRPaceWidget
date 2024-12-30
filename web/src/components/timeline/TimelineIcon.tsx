import { useContext } from 'react';

import { AppContext } from '../../context';

type TimelineIconProps = {
  className?: string;
  type?: string;
};

export const TimelineIcon = ({ className, type }: TimelineIconProps) => {
  const { theme } = useContext(AppContext);
  return (
    <div
      className={className}
      style={{ backgroundImage: `url(${process.env.REACT_APP_PATH_PREFIX}/theme/${theme}/icon/${type}.png)` }}
    />
  );
};
