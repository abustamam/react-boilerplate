const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const merge = require('webpack-merge')
const validate = require('webpack-validator')
const pkg = require('./package.json')

const parts = require('./libs/parts')

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
}

const common = {
	entry: {
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
				devtool: 'source-map'
			},
			parts.setFreeVariable(
				'process.env.NODE_ENV',
				'production'
			),
			parts.extractBundle({
				name: 'vendor',
				entries: Object.keys(pkg.dependencies)
			}),
			parts.minify(),
			parts.setupCSS(PATHS.app)
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
			parts.setupCSS(PATHS.app)
		)
}

module.exports = validate(config)