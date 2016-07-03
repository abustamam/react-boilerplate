const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const merge = require('webpack-merge')
const validate = require('webpack-validator')
const pkg = require('./package.json')

const parts = require('./libs/parts')

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: path.join(__dirname, 'app', 'stylesheets', 'main.sass'),
  build: path.join(__dirname, 'build'),
  images: path.join(__dirname, 'public', 'assets', 'images'),
  fonts: path.join(__dirname, 'public', 'assets', 'fonts')
}

const common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new FaviconsWebpackPlugin('./public/assets/images/webpack.png'),
    new HtmlWebpackPlugin({
      title: 'Webpack Demo'
    })
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: PATHS.app
      }
    ]
  }
}

let config
let opts = {}

switch (process.env.npm_lifecycle_event) {
case 'stats':
  opts.quiet = true
case 'build':
  console.log('BUILD')
  config = merge(
    common,
    {
      devtool: 'source-map',
      output: {
        path: PATHS.build,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js'
      }
    },
    parts.clean(PATHS.build),
    parts.setFreeVariable(
      'process.env.NODE_ENV',
      'production'
    ),
    parts.extractBundle({
      name: 'vendor',
      entries: Object.keys(pkg.dependencies)
    }),
    parts.minify(),
    parts.images(PATHS.images),
    parts.fonts(PATHS.fonts),
    parts.extractCSS(PATHS.style),
    parts.purifyCSS([PATHS.app])
  )
  break
default:
  console.log('DEFAULT')
  config = merge(
    common,
    {
      devtool: 'eval-source-map'
    },
    parts.devServer({
      host: process.env.HOST,
      port: process.env.PORT
    }),
    parts.images(PATHS.images),
    parts.fonts(PATHS.fonts),
    parts.setupCSS(PATHS.style)
  )
}

module.exports = validate(config, opts)
