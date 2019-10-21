var webpack = require('webpack');
var path = require('path');

var PRODUCTION_MODE = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
	entry: './src/arena.js',
	devtool: 'source-map',
	output: {
		filename: PRODUCTION_MODE? 'arena.min.js' : 'arena.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			/*{ 
				test: /\.js$/, 
				use: 'babel-loader?presets[]=es2015' 
			},*/
			{
			  test: /\.m?js$/,
			  exclude: /(node_modules|bower_components)/,
			  use: {
				loader: 'babel-loader',
				options: {
				  presets: ['@babel/preset-env']
				}
			  }
			},
			{
				test: /\.html$/,
				use: 'raw!html-minify'
			}
		]
	}
};