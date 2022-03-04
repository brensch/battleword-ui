import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { } from '@mui/x-data-grid/themeAugmentation';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4-ALWA22Cm25Qacua-2XkMLQVenbkvRw",
  authDomain: "battleword.firebaseapp.com",
  projectId: "battleword",
  storageBucket: "battleword.appspot.com",
  messagingSenderId: "339690027814",
  appId: "1:339690027814:web:67f15febedee1dbf6c1fe7",
  measurementId: "G-K8VLGZHGDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);



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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
