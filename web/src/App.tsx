import React from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { IndicatorPage } from './pages/IndicatorPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { SegmentPage } from './pages/SegmentPage';
import { TimelinePage } from './pages/TimelinePage';
import { TopPage } from './pages/TopPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TopPage />,
  },
  {
    path: '/timeline',
    element: <TimelinePage />,
  },
  {
    path: '/indicator',
    element: <IndicatorPage />,
  },
  {
    path: '/segment',
    element: <SegmentPage />,
  },
  {
    path: '/playground',
    element: <PlaygroundPage />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
