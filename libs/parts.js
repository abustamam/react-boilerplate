const webpack = require('webpack')

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