import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBmIzrBsw2_xkfKHyBi-NnMsgHlbnlL9kw',
  authDomain: 'mini-url-d15ac.firebaseapp.com',
  projectId: 'mini-url-d15ac',
  storageBucket: 'mini-url-d15ac.appspot.com',
  messagingSenderId: '581436341123',
  appId: '1:581436341123:web:8ecaa560d616847290d4b6',
  measurementId: 'G-Q594VB2WJY',
};

initializeApp(firebaseConfig);
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
