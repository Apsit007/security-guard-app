// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import App from './App';       // ✅ ใช้ App ตรงๆ ไม่ใช่ AppRouter
import { Provider } from 'react-redux';
import { store } from './store';
import './styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.Fragment>
);
