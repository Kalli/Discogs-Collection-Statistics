const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = env => {
	let copyConfig = [
		{ from: 'static' },
		{ from: 'output' }
	]
	if (env && env.production){
		copyConfig[0]['to'] = 'static/'
		copyConfig[1]['to'] = 'dist/output'
	}
	return {
		entry: './src/index.js',
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules|bower_components)/,
					loader: "babel-loader",
					options: { presets: ["@babel/env"] }
				},
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader"]
				}
			]
		},
		output: {
			filename: 'main.js',
			path: path.resolve(__dirname, 'dist')
		},
		plugins: [
			new CopyWebpackPlugin(copyConfig),
		]
	}
};