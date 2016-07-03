const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack-plugin')

exports.devServer = function(options) {
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

exports.setupCSS = function(paths) {
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

exports.minify = function() {
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

exports.setFreeVariable = function(key, value) {
	const env = {}
	env[key] = JSON.stringify(value)
	return {
		plugins: [
			new webpack.DefinePlugin(env)
		]
	}
}

exports.extractBundle = function(options) {
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

exports.clean = function(path) {
	return {
		plugins: [
			new CleanWebpackPlugin([path], {
				root: process.cwd()
			})
		]
	}
}

exports.extractCSS = function(paths) {
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

exports.purifyCSS = function(paths) {
	return {
		plugins: [
			new PurifyCSSPlugin({
				basePath: process.cwd(),
				paths
			})
		]
	}
}

exports.images = function(paths) {
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

exports.fonts = function(paths) {
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