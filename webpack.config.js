const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const merge = require('webpack-merge')
const validate = require('webpack-validator')

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
		filename: 'bundle.js'
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
		config = merge(common, {})
		break
	default:
		console.log("DEFAULT")
		config = merge(common, parts.devServer({
			host: process.env.HOST,
			port: process.env.PORT
		}))
}

module.exports = validate(config)