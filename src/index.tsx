import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import type { } from '@mui/x-data-grid/themeAugmentation';

import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121213"
    },
    primary: {
      main: "#121213",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffffff",
    },

  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // backgroundColor: '#818384',
        },
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
