import React, { useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import { DemoWarning } from '../components/ui/DemoWarning';
import { Indicator } from '../components/widget/Indicator';
import { AppContext } from '../context';
import { decodeOverrides } from '../utils/overrides';
import { usePageData, useThemeOverrides } from '../hooks';

export const IndicatorPage = () => {
  const [searchParams] = useSearchParams({ theme: 'default' });
  const theme = searchParams.get('theme') || 'default';
  const isDemo = searchParams.get('demo') === '1';
  // ?icons=<セットid> でテーマの指定を上書きする
  const iconSetOverride = searchParams.get('icons') || undefined;
  // ?v=<base64> でテーマのトークンを上書きする
  const themeOverrides = useMemo(() => decodeOverrides(searchParams.get('v')), [searchParams]);
  useThemeOverrides(themeOverrides);
  // ?face=skin で走者のスキンを顔にする（?face=theme でテーマの絵に戻す）
  const faceParam = searchParams.get('face');
  const faceSkinOverride = faceParam === null ? undefined : faceParam === 'skin';
  // ?scaleMin= / ?scaleStep= で横軸の初期幅と伸縮単位を秒で上書きする
  const seconds = (key: string) => {
    const raw = searchParams.get(key);
    if (raw === null) {
      return undefined;
    }
    const value = Number(raw);
    return Number.isFinite(value) ? value : undefined;
  };

  const { isLoading, timeline, pbTimeline, setting, iconSet, errors } = usePageData(theme, isDemo, {
    iconSet: iconSetOverride,
    faceSkin: faceSkinOverride,
    scaleMinSeconds: seconds('scaleMin'),
    scaleStepSeconds: seconds('scaleStep'),
  });

  if (isLoading) {
    return <></>;
  }

  if (errors.length > 0 || !timeline || !setting || !pbTimeline) {
    return (
      <div className="warning-container">
        {errors.map((error, i) => (
          <div key={i} className="warning">
            {error}
          </div>
        ))}
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ timeline, pbTimeline, theme, setting, iconSet }}>
      {isDemo && <DemoWarning />}
      <Indicator />
    </AppContext.Provider>
  );
};
