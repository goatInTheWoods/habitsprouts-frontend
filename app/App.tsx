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
// @ts-expect-error TS(2345) FIXME: Argument of type 'Element | null' is not assignabl... Remove this comment to see the full error message
const root = ReactDOM.createRoot(document.querySelector(app));
root.render(
  <StrictMode>
    <Main queryClient={queryClient} />
  </StrictMode>
);

// @ts-expect-error TS(2339) FIXME: Property 'hot' does not exist on type 'NodeModule'... Remove this comment to see the full error message
if (module.hot) {
  // @ts-expect-error TS(2339) FIXME: Property 'hot' does not exist on type 'NodeModule'... Remove this comment to see the full error message
  module.hot.accept();
}
