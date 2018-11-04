const path = require('path');
const ConcatPlugin = require('webpack-concat-plugin');

module.exports = env => 
{
	return {
		output: {
			path: path.resolve(__dirname, 'docs/js'),
			filename: (env == 'prod' ? 'avoid.min.js' : 'avoid.js')
		},
		optimization: {
			minimize: false
		},
		entry: './src/avoid.js',
		plugins: [
			new ConcatPlugin({
				uglify: (env == 'prod'),
				sourceMap: false,
				fileName: (env == 'prod' ? 'avoid.min.js' : 'avoid.js'),
				filesToConcat: [
					'./src/_ext/**',

					'./src/avoid.js',
					'./src/conf.js',
					'./src/core/**',
					'./src/libs/**',
					'./src/templater/Templater.js',
					'./src/templater/cmp/**',
					'./src/ui/**',
					'./src/cmd.js',
				],
				attributes: {
					 async: true
				}
			})
		]
	}; 
};