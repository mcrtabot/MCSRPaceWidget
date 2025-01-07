import { ImageCommonParameters, ImageItemParameters } from '../components/builder';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { ImageBuilder } from '../components/builder/ImageBuilder';
import { parseCommonParams, parseItemParams, toQueryString } from '../utils/image-builder';

export const ImageBuilderPage = () => {
  const [searchParams] = useSearchParams({ theme: 'builder' });
  const [commonParams, setCommonParams] = useState<ImageCommonParameters>(parseCommonParams(searchParams));
  const [itemParamsList, setItemParamsList] = useState<ImageItemParameters[]>(parseItemParams(searchParams));
  const setting = {
    label: {
      enter_nether: 'Enter Nether',
      enter_bastion: 'Enter Bastion',
      enter_fortress: 'Enter Fortress',
      first_portal: 'First Portal',
      second_portal: 'Second Portal',
      enter_stronghold: 'Enter Stronghold',
      portal_room: 'Portal Room',
      enter_end: 'Enter End',
      credits: 'Finish',
    },
    pbTimelineTitle: '',
    paceTimelineTitle: '',
    nextItemStyle: 'hyphen',
  } as const;

  const onChangeCommonParameters = useCallback((newCommonParams: ImageCommonParameters) => {
    setCommonParams(newCommonParams);
  }, []);

  const onChangeItemParameters = useCallback((newItemParamsList: ImageItemParameters[]) => {
    setItemParamsList(newItemParamsList);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const searchParamsString = toQueryString({ commonParams, itemParamsList });
    const url = searchParamsString ? `${location.pathname}?${searchParamsString}` : location.pathname;

    // クエリパラメータ含めて同じURLには遷移しない
    if (url === location.pathname + location.search) {
      return;
    }
    navigate(url);
  }, [commonParams, itemParamsList, location.pathname, location.search, navigate]);

  return (
    <ImageBuilder
      commonParams={commonParams}
      itemParamsList={itemParamsList}
      setting={setting}
      onChangeCommonParams={onChangeCommonParameters}
      onChangeItemParams={onChangeItemParameters}
    />
  );
};
