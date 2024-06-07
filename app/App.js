import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import Main from '@/components/Main';
import './scss/styles.scss';
import 'bootstrap';
import 'react-day-picker/dist/style.css';
import '@/scss/day-picker.scss';

const queryClient = new QueryClient();

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const app = '#app';
const root = ReactDOM.createRoot(document.querySelector(app));
root.render(
  <StrictMode>
    <Main queryClient={queryClient} />
  </StrictMode>
);

if (module.hot) {
  module.hot.accept();
}
