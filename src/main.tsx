// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import App from './App';       // ✅ ใช้ App ตรงๆ ไม่ใช่ AppRouter
import { Provider } from 'react-redux';
import { store } from './store';
import './styles/global.css';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
