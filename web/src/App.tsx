import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ImageBuilderPage } from './pages/ImageBuilderPage';
import { IndicatorPage } from './pages/IndicatorPage';
import React from 'react';
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
    path: '/visualtimeline',
    element: <IndicatorPage />,
  },
  {
    path: '/image/builder',
    element: <ImageBuilderPage />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
