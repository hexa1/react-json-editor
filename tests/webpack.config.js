const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-module-inline-source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('test'),
    }),
  ],
  resolve: {
    modulesDirectories: [
      path.join(__dirname, '..', 'src'),
      'node_modules',
    ],
  },
};
