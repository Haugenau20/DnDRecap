import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Router wrapper component to handle redirects
const RouterWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the route from URL parameters
    const params = new URLSearchParams(window.location.search);
    const route = params.get('route');
    
    if (route) {
      // Remove the query parameter and navigate to the actual route
      const newUrl = window.location.pathname.replace(/\/$/, '');
      window.history.replaceState(null, '', newUrl);
      navigate('/' + route);
    }
  }, [navigate]);

  return <App />;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter basename="/DnDRecap">
      <RouterWrapper />
    </BrowserRouter>
  </React.StrictMode>
);