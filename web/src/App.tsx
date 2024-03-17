import React from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { TimelinePage } from './pages/TimelinePage';
import { TopPage } from './pages/TopPage';
import { IndicatorPage } from './pages/IndicatorPage';

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
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
