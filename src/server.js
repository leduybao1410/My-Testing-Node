// Import the 'http' module
require('dotenv').config();
const { getLocalIpAddress } = require('./config/helpers');
const express = require('express');
const app = express();
const { router } = require('./routes/web');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { WebSocket } = require('ws');
const { onConnectionWss } = require('./middleware/socket');
// Define the hostname and port
const hostname = process.env.HOST_NAME; // Localhost
const port = process.env.PORT || 3000;

// Add this line to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

//initialize routes
app.use('/', router);

// Start the server and listen on the specified port
const server = app.listen(port, hostname, () => {
  console.log(`Server running ${hostname} at http://${getLocalIpAddress()}:${port}/`);
});

const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws) => onConnectionWss(ws));