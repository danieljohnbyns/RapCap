const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
	packagerConfig: {
		asar: true,
		appBundleId: 'com.danieljohnbyns.rapcap',
		appCategoryType: 'public.app-category.event-utilities',
		protocols: [
			{
				name: 'RapCap',
				schemes: ['rapcap']
			}
		]
	},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'rapcap',
				setupIcon: './src/assets/icons/icon.ico',
				exe: 'rapcap.exe',
				loadingGif: './assets/icons/loading.gif',
				authors: 'Daniel John Baynosa'
			}
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				maintainer: 'Daniel John Baynosa',
				icon: './src/assets/icons/icon.png',
				productName: 'RapCap',
				exec: 'rapcap'
			}
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				maintainer: 'Daniel John Baynosa',
				icon: './src/assets/icons/icon.png',
				productName: 'RapCap',
				exec: 'rapcap'
			}
		},
	],
	publishers: [],
	plugins: [
		{
			name: '@electron-forge/plugin-auto-unpack-natives',
			config: {}
		},
		{
			name: '@electron-forge/plugin-webpack',
			config: {
				port: 3029,
				loggerPort: 3030,
				devContentSecurityPolicy: `img-src http: https: data:; script-src http: https: 'unsafe-inline' 'unsafe-eval'; style-src http: https: 'unsafe-inline'; connect-src http: https: ws:; frame-src http: https:; object-src http: https:; media-src http: https:; font-src http: https:;`,
				mainConfig: './webpack.main.config.js',
				renderer: {
					config: './webpack.renderer.config.js',
					entryPoints: [
						{
							html: './src/index.html',
							js: './src/renderer.js',
							name: 'main_window',
							preload: {
								js: './src/preload.js'
							}
						}
					]
				}
			}
		},
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true
		})
	]
};
