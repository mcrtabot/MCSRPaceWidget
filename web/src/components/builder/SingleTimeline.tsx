import React, { useContext, useLayoutEffect } from 'react';
import { AppContext } from '../../context';
import { Timeline } from '../timeline/Timeline';

export const SingleTimeline = () => {
  const { timeline, theme, setting } = useContext(AppContext);
  useLayoutEffect(() => {
    const head = document.head;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `${process.env.REACT_APP_PATH_PREFIX}/theme/${theme}/timeline.css`;

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, [theme]);

  return <Timeline className="timeline timeline--pace" timeline={timeline.timelines} labels={setting.label} />;
};
