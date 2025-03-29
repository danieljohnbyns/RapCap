const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/main.js',
	module: {
		rules: require('./webpack.rules')
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		extensionAlias: {
			'.js': ['.js', '.jsx'],
			'.json': ['.json', '.node']
		}
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: 'src/fonts', to: 'fonts' }
			]
		})
	]
};
