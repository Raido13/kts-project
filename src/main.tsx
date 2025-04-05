import '@shared/config/configureMobX';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@shared/styles/_global.scss';
import { App } from '@shared/app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
