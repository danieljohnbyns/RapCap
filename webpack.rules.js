module.exports = [
	{
		test: /native_modules[/\\].+\.node$/,
		use: 'node-loader'
	},
	{
		test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
		parser: { amd: false },
		use: {
			loader: '@vercel/webpack-asset-relocator-loader',
			options: {
				outputAssetBase: 'native_modules'
			}
		}
	},
	{
		test: /\.jsx?$/,
		use: {
			loader: 'babel-loader',
			options: {
				exclude: /node_modules/,
				presets: ['@babel/preset-react'],
				compact: false
			}
		}
	},
	{
		test: /\.(ttf|otf|eot|svg|woff2|woff)$/,
		use: [
			{
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
					publicPath: '../',
				},
			},
		],
	}
];
