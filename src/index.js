import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client' instead
import "./index.css";
import App from "./components/App";

// Create a root element and render the App component
const root = ReactDOM.createRoot(document.getElementById("root")); 
root.render(<App />);
