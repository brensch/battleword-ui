import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { BrowserRouter } from "react-router-dom";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import type { } from '@mui/x-data-grid/themeAugmentation';

import CssBaseline from '@mui/material/CssBaseline';

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
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });


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
