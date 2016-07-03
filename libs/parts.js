const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const NpmInstallPlugin = require('npm-install-webpack-plugin')
const stylelint = require('stylelint')
const path = require('path')

exports.indexTemplate = function (options) {
  const favicon = path.join(options.faviconPath, options.favicon)
  return {
    plugins: [
      new HtmlWebpackPlugin({
        template: require('html-webpack-template'),
        title: options.title,
        appMountId: options.appMountId,
        inject: false
      }),
      new FaviconsWebpackPlugin(favicon)
    ]
  }
}

exports.loadJSX = function (include) {
  return {
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          // Enable caching for extra performance
          loaders: ['babel?cacheDirectory'],
          include
        }
      ]
    }
  }
}

exports.lintJSX = function (include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.jsx?$/,
          loaders: ['eslint'],
          include
        }
      ]
    }
  }
}


exports.enableReactPerformanceTools = function () {
  return {
    module: {
      loaders: [
        {
          test: require.resolve('react'),
          loader: 'expose?React'
        }
      ]
    }
  }
}

exports.devServer = function (options) {
  return {
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host,
      port: options.port
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  }
}

exports.setupCSS = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.sass$/,
          loaders: ['style', 'css', 'sass'],
          include: paths
        },
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: paths
        }
      ]
    }
  }
}

exports.postCSS = function (include) {
  return {
    postcss: function () {
      return [
        stylelint({
          plugins: [
            'stylelint-scss'
          ],
          rules: {
            'color-hex-case': 'lower'
          }
        })
      ]
    },
    module: {
      preLoaders: [
        {
          test: /\.(c|sa)ss$/,
          loaders: ['postcss'],
          include
        }
      ]
    }
  }
}

exports.minify = function () {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        mangle: {
          except: ['webpackJsonp']
        }
      })
    ]
  }
}

exports.setFreeVariable = function (key, value) {
  const env = {}
  env[key] = JSON.stringify(value)
  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  }
}

exports.extractBundle = function (options) {
  const entry = {}
  entry[options.name] = options.entries

  return {
    entry,
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })
    ]
  }
}

exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  }
}

exports.extractCSS = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.sass$/,
          loader: ExtractTextPlugin.extract('style', 'css!sass'),
          include: paths
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  }
}

exports.purifyCSS = function (paths) {
  return {
    plugins: [
      new PurifyCSSPlugin({
        basePath: process.cwd(),
        paths
      })
    ]
  }
}

exports.images = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.(jpg|png)$/,
          loaders: [
            'file?name=[path][name].[hash].[ext]',
            'url?limit=25000',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
          ],
          include: paths
        }
      ]
    }
  }
}

exports.fonts = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url',
          query: {
            limit: 50000,
            mimetype: 'application/font-woff',
            name: './fonts/[hash].[ext]'
          },
          include: paths
        }
      ]
    }
  }
}


exports.npmInstall = function (options = {}) {
  options = options || {}

  return {
    plugins: [
      new NpmInstallPlugin(options)
    ]
  }
}
