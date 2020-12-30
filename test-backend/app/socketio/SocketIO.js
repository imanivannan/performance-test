// External Modules
const socket = require('socket.io');
const http = require('http');
const express = require('express');

const TEST_NAMESPACE="/test";
// Instanitate app
const app = express();

// Create server
const httpServer = http.createServer(app);

// Instanitate socket
const io = socket(httpServer);
module.exports = {
      io,
      httpServer,
      TEST_NAMESPACE,
};