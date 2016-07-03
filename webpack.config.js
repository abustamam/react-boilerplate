const path = require('path')
const merge = require('webpack-merge')
const validate = require('webpack-validator')
const pkg = require('./package.json')

const parts = require('./libs/parts')

const TARGET = process.env.npm_lifecycle_event
process.env.BABEL_ENV = TARGET

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: path.join(__dirname, 'app', 'stylesheets', 'main.sass'),
  build: path.join(__dirname, 'build'),
  images: path.join(__dirname, 'public', 'assets', 'images'),
  fonts: path.join(__dirname, 'public', 'assets', 'fonts')
}

const common = merge(
  {
    entry: {
      style: PATHS.style,
      app: PATHS.app
    },
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  },
  parts.indexTemplate({
    title: 'Webpack Demo',
    appMountId: 'app',
    faviconPath: PATHS.images,
    favicon: 'webpack.png'
  }),
  // parts.postCSS(PATHS.app),
  parts.loadJSX(PATHS.app),
  parts.lintJSX(PATHS.app),
  parts.images(PATHS.images),
  parts.fonts(PATHS.fonts)
)

let config
let opts = {}

switch (TARGET) {
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
    parts.setupCSS(PATHS.style),
    parts.devServer({
      host: process.env.HOST,
      port: process.env.PORT
    }),
    parts.enableReactPerformanceTools(),
    parts.npmInstall()
  )
}

module.exports = validate(config, opts)
