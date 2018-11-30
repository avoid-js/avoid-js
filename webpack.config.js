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
		name: 'type',
		short: 't',
		type: 'string'
	}
]).run();

const configDefaults = {
	destination: 'build',
	type: 'module' // module|plain
};

const config = Object.assign({}, configDefaults, args.options);

const files = [
	'./src/_ext/**',

	'./src/avoid.js',
	'./src/conf.js',
	'./src/core/**',
	'./src/libs/**',
	'./src/templater/Templater.js',
	'./src/templater/cmp/**',
	'./src/ui/**',
	'./src/cmd.js',
];

switch(config.type)
{
	case 'plain':
		break;
	case 'module':
        files.push('./src/export.js');
		break;
	default:
		throw new Error(`Type '${config.type}' is not supported.`);
}

module.exports = () =>
{
	return {
		output: {
			library: 'AvoidJS',
            libraryTarget: "umd",
            path: path.resolve(__dirname, config.destination),
			filename: 'avoid.js'
		},
		entry: './src/avoid.js',
		plugins: [
			// source version
			new ConcatPlugin({
				uglify: false,
				sourceMap: false,
				fileName: 'avoid.js',
				filesToConcat: files,
				attributes: {
					 async: true
				}
			}),
			// minified version
            new ConcatPlugin({
                uglify: true,
                sourceMap: false,
                fileName: 'avj.min.js',
                filesToConcat: files,
                attributes: {
                    async: true
                }
            })
		]
	}; 
};