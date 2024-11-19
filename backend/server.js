const jsonServer = require('json-server');
const express = require('express');
const cors = require('cors'); // Import CORS for cross-origin requests
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Reference to the JSON database
const middlewares = jsonServer.defaults(); // Use default middlewares

// Enable CORS for all routes and methods (including PATCH)
server.use(cors({
  origin: '*', // Allows requests from all origins, you can limit it to a specific domain for more security
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow all HTTP methods
}));

// Serve static files (like images) from the "public" folder using Express
server.use(express.static(path.join(__dirname, 'public')));

// Apply default middlewares (logger, static, CORS, and no-cache)
server.use(middlewares);

// Serve API routes from db.json
server.use(router);

// Start the server on port 6001 (or the port specified in the environment variable)
server.listen(process.env.PORT || 6002, () => {
  console.log('JSON Server is running');
});

