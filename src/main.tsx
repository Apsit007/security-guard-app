import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import AppRouter from './routes/Router';
import { Provider } from 'react-redux';
import { store } from './store';
import './styles/global.css';
// TomTom Maps CSS can also be imported here globally (optional if done in component)
import '@tomtom-international/web-sdk-maps/dist/maps.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);