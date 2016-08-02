const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    if (fs.statSync(path.join(__dirname, dir)).isDirectory()) {
      entries[dir] = path.join(__dirname, dir, 'app.js');
    }

    return entries;
  }, {}),

  output: {
    path: `${__dirname}/build`,
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/build/',
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.json$/, loader: 'json' },
    ],
  },

  resolve: {
    alias: {
      'react-json-editor': path.join(__dirname, '..', 'src'),
    },
  },

  node: {
    __dirname: true,
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
};
