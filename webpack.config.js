const path = require('path');
const argv = require('argv');
const ConcatPlugin = require('webpack-concat-plugin');

const args = argv.option([
	{
		name: 'destination',
		short: 'd',
		type: 'string'
	},
	{
		name: 'minify',
		short: 'm',
		type: 'boolean'
	}
]).run();

const configDefaults = {
	destination: 'build',
	minify: false
};

const config = Object.assign({}, configDefaults, args.options);

module.exports = () =>
{
	return {
		output: {
			path: path.resolve(__dirname, config.destination),
			filename: (config.minify ? 'avj.min.js' : 'avoid.js')
		},
		entry: './src/avoid.js',
		plugins: [
			new ConcatPlugin({
				uglify: config.minify,
				sourceMap: false,
				fileName: (config.minify ? 'avj.min.js' : 'avoid.js'),
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