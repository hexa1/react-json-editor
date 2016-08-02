const fs = require('fs');
const path = require('path');
const express = require('express');
const rewrite = require('express-urlrewrite');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackConfig = require('./webpack.config');

const app = express();

app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: '/build/',
  stats: false,
}));

fs.readdirSync(__dirname).forEach(file => {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
    app.use(rewrite(`/${file}/*`, `/${file}/index.html`));
  }
});

app.use(express.static(__dirname));

app.get('/editor.css', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'jsonEditor.css'));
});

app.listen(9009, () => {
  console.log('Server listening on http://localhost:9009'); // eslint-disable-line no-console
});
