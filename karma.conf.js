const webpackConfig = require('./tests/webpack.config');

module.exports = config => {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    reporters: ['mocha'],

    files: ['tests/index.js'],

    preprocessors: {
      'tests/index.js': ['webpack'],
      '**/*.js': ['sourcemap'],
    },

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true,
    },

    autoWatch: false,
    singleRun: true,
    colors: true,

    client: {
      mocha: {
        bail: true,
      },
    },
  });
};
