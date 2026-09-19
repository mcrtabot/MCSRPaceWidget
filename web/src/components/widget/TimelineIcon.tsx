import { useContext } from 'react';

import { AppContext } from '../../context';

type TimelineIconProps = {
  className?: string;
  type?: string;
};

export const TimelineIcon = ({ className, type }: TimelineIconProps) => {
  const { theme, iconSet } = useContext(AppContext);

  // 共通アイコンセットに絵があればそれを使い、無ければテーマ同梱の icon/ を見る
  const file = type ? iconSet?.icons[type] : undefined;
  const url = file ? `/icon/${iconSet!.id}/${file}` : `/theme/${theme}/icon/${type}.png`;

  // テーマCSS側から --icon-<type> で1枚だけ差し替えられるようにしておく
  const backgroundImage = type ? `var(--icon-${type}, url(${url}))` : `url(${url})`;

  return <div className={className} style={{ backgroundImage }} />;
};
