/*
 * Express server configuration
 */

const express = require('express');
const handlers = require('./handlers');

const port = 3000;
const app = express();

app.use(express.static('frontend'));
app.get('/api', handlers.apihandler);
app.get('/', handlers.home);

const server = app.listen(port, () => console.log('Server listening on port 3000!')); // eslint-disable-line no-console

module.exports = server;