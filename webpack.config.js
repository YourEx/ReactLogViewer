var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  devtool: 'inline-source-map',
  entry: {
    app: ['./src/app/index.js'],
    styles: ['./src/styles/grv-app.scss']
  },

 output: {
    path: path.join(__dirname, 'dist/'),   
    publicPath: 'assets/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js',
    sourceMapFilename: '[name].map'
  },

  externals: ['React', 'jQuery'],

  module: {
   preLoaders: [
      {
        test: /\.js$/,
        loaders: ['eslint', 'source-map'],
        exclude: /node_modules/
      }
    ],

    loaders: [    
      { 
          include: path.join(__dirname, 'src'),
          test: /\.js$/, 
          exclude: /node_modules/, 
          loader: 'babel?loose=all' 
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass?outputStyle=expanded'
      }
    ]
  },

  node: {
//    Buffer: true
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()    
  ],

  eslint: {
  //  emitError: true
//    failOnError: true
  }
 
};
