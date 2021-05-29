import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
<<<<<<< HEAD
import { RecoilRoot } from 'recoil';
=======
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { SettingsProvider } from './contexts/SettingsContext';
import { RecoilRoot } from 'recoil';
import ThemeConfig from './theme';
>>>>>>> feature_UI/UX

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
<<<<<<< HEAD
      <BrowserRouter>
        <App />
      </BrowserRouter>
=======
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SettingsProvider>
          <ThemeConfig>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeConfig>
        </SettingsProvider>
      </LocalizationProvider>
>>>>>>> feature_UI/UX
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
