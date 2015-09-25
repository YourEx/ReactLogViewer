var webpack = require('webpack');

module.exports = function (config) {
  // Browsers to run on BrowserStack
  var customLaunchers = {
    BS_Chrome: {
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '8.1',
      browser: 'chrome',
      browser_version: '39.0',
    }
  };

  config.set({    
    //singleRun: true,
    customLaunchers: customLaunchers,
//     browsers: [ /*'Chrome'*/ "PhantomJS" ],
    browsers: [ 'Chrome'],

    frameworks: [ 'mocha' ],
/*    reporters: [ 'html' ],*/
    reporters: [ 'mocha' ],
    files: [
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'https://code.jquery.com/jquery-2.1.4.js',
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: {
      devtool: 'inline-source-map',
      externals: ['React', 'jQuery', 'sinon'],
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },

    webpackServer: {
      noInfo: true
    }
  });
};
