import React from 'react';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import 'dayjs/locale/ja';
import ReactDOM from 'react-dom/client';

import { App } from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <MantineProvider defaultColorScheme="auto">
    <App />
  </MantineProvider>,
);
