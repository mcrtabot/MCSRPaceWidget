import 'dayjs/locale/ja';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { HelmetProvider } from 'react-helmet-async';
import { ImageBuilderPage } from './pages/ImageBuilderPage';
import React from 'react';
import ReactDOM from 'react-dom/client';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <ImageBuilderPage />,
    },
  ],
  { basename: process.env.REACT_APP_PATH_PREFIX },
);

export const App = () => {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
