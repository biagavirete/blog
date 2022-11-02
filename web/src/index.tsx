import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAv6fYgxttMN2uwJwtAFeeD85KnNUv3jOo",
  authDomain: "blog-auth-46f00.firebaseapp.com",
  projectId: "blog-auth-46f00",
  storageBucket: "blog-auth-46f00.appspot.com",
  messagingSenderId: "569584140555",
  appId: "1:569584140555:web:3ec552c7aa953f9bc0620e",
  measurementId: "G-2EPNYQK819"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
