const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
}

module.exports = {
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