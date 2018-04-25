/*
 * Express server configuration
 */

import express from 'express';
import handlers from './handlers';
import webpack from 'webpack';
import config from '../webpack.config';

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.get('/api', handlers.apihandler);
// app.get('/', handlers.home);

const server = app.listen(port, () => console.log('Server listening on port 3000!')); // eslint-disable-line no-console

module.exports = server;