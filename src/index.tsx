// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Only import session testing tools in development
if (process.env.NODE_ENV === 'development') {
  import('./utils/__dev__/sessionTester')
    .then(() => console.log('Session testing utilities loaded'))
    .catch(err => console.error('Failed to load session testing utilities:', err));
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);