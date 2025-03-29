const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/main.js',
	module: {
		rules: require('./webpack.rules')
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
		fallback: {
			path: require.resolve('path-browserify')
		}
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: 'src/assets', to: 'assets' }
			]
		})
	]
};
