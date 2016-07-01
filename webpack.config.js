const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const NpmInstallPlugin = require('npm-install-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const validate = require('webpack-validator')

const TARGET = process.env.npm_lifecyle_event
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

const common = {
  devtool: 'eval',
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
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
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    }),
    new FaviconsWebpackPlugin('../public/webpack.svg')
  ]
};

let config

switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(common, {

    })
    break
  case 'start':
    config = merge(common, {
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
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new NpmInstallPlugin({save: true}),
        new FaviconsWebpackPlugin('../public/webpack.svg')
      ]
    })
    break
  default:
    config = merge(common, {})
}

module.exports = validate(config)