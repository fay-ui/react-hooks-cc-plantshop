const jsonServer = require('json-server');
const path = require('path');
const express = require('express'); // Import express

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Serve static files from the "public" folder using Express
server.use(express.static(path.join(__dirname, 'public'))); // <-- Updated line

// Apply default middlewares (logger, static, cors, and no-cache)
server.use(middlewares);

// Serve API routes from db.json
server.use(router);

// Start the server on the specified port (defaults to 6001 or environment variable port)
server.listen(process.env.PORT || 6001, () => {
  console.log('JSON Server is running');
});
