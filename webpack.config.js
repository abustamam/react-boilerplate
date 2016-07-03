const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const merge = require('webpack-merge')
const validate = require('webpack-validator')
const pkg = require('./package.json')

const parts = require('./libs/parts')

const PATHS = {
	app: path.join(__dirname, 'app'),
	style: path.join(__dirname, 'app', 'main.sass'),
	build: path.join(__dirname, 'build')
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
		new FaviconsWebpackPlugin('./public/webpack.png'),
		new HtmlWebpackPlugin({
			title: 'Webpack Demo'
		})
	]
}

let config

switch(process.env.npm_lifecycle_event) {
	case 'build': 
		console.log("BUILD")
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
		console.log("DEFAULT")
		config = merge(
			common, 
			{
				devtool: 'eval-source-map'
			},
			parts.devServer({
				host: process.env.HOST,
				port: process.env.PORT
			}),
			parts.setupCSS(PATHS.style)
		)
}

module.exports = validate(config)