var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')

var TARGET = process.env.npm_lifecyle_event
var PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
}

var common = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    './src/index'
  ],
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.js|\.jsx$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },
    {
      test: /\.sass$/,
      loader: "style!css!sass"
    },
    {
      test: /\.css$/,
      loaders: "style!css"
    }]
  }
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT
    }
  })
}

if(TARGET === 'build') {
  module.exports = merge(common, {})
}