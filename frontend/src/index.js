import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartProvider';

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
