const jsonServer = require('json-server');
const path = require('path');
const express = require('express'); // Import express
const cors = require('cors'); // Import CORS for cross-origin requests

const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Reference to the JSON database
const middlewares = jsonServer.defaults(); // Use default middlewares

// Enable CORS for your frontend (Replace with the URL of your frontend)
server.use(cors({
  origin: 'https://fay-ui.github.io', // This allows requests from your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers (if necessary)
}));

// Serve static files (like images) from the "public" folder using Express
server.use(express.static(path.join(__dirname, 'public')));

// Apply default middlewares (logger, static, CORS, and no-cache)
server.use(middlewares);

// Serve API routes from db.json
server.use(router);

// Start the server on port 6001 (or the port specified in the environment variable)
server.listen(process.env.PORT || 6001, () => {
  console.log('JSON Server is running on port 6001');
});
