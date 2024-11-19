import React from 'react';
import ReactDOM from 'react-dom/client';  // Use 'react-dom/client' in React 18
import './index.css';
import App from './components/App';  // Make sure the path is correct for your App

import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Create the root container
root.render(
  <Router>
    <App />
  </Router>
);
