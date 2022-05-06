const sass = require('sass');

module.exports = grunt => {
	require('load-grunt-tasks')(grunt);

	const packageJSON = grunt.file.readJSON('package.json');

	const banner = `
// ==UserScript==
// @name         Neon Bunny Snowflake Theme
// @namespace    ${packageJSON.homepage}
// @version      ${packageJSON.version}
// @description  ${packageJSON.description}
// @author       ${packageJSON.author}
// @match        *.snowflakecomputing.com/console
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snowflakecomputing.com
// @grant        GM_addStyle
// @license      ${packageJSON.license}
// ==/UserScript==
`;

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		name: 'slide-out-panel',
		// -------------------------- Clean //
		clean: {
			src: ['.temp'],
		},
		// ==================================================== JavaScript Tasks //
		// -------------------------- Babel //
		babel: {
			dev: {
				options: {
					comments: false,
					sourceMap: false,
					presets: ['@babel/preset-env'],
				},
				files: {
					'.temp/neon-bunny-snowflake-theme.js': 'src/js/neon-bunny-snowflake-theme.js',
				},
			},
		},
		// -------------------------- ESLINT //
		eslint: {
			options: {
				maxWarnings: 10,
				fix: grunt.option('fix'),
			},
			target: ['src/**/*.js'],
		},
		// -------------------------- Uglify //
		uglify: {
			options: {
				beautify: false,
				mangle: true,
				sourceMap: false,
			},
			dist: {
				files: {
					'dist/neon-bunny-snowflake-theme.user.js': ['.temp/neon-bunny-snowflake-theme.js'],
				},
			},
		},
		usebanner: {
			taskName: {
				options: {
					position: 'top',
					banner,
					linebreak: true,
				},
				files: {
					src: ['dist/neon-bunny-snowflake-theme.user.js'],
				},
			},
		},
		// ==================================================== Style Tasks //
		// -------------------------- Stylelint //
		stylelint: {
			options: {
				configFile: 'stylelint.config.js',
				formatter: 'string',
				ignoreDisables: false,
				failOnError: true,
				fix: true,
				reportNeedlessDisables: false,
				syntax: '',
			},
			src: ['src/**/*.scss'],
		},
		// -------------------------- SCSS //
		sass: {
			options: {
				implementation: sass,
				precision: 10,
			},
			dev: {
				options: {
					outputStyle: 'expanded',
					sourceMap: false,
					implementation: sass,
					precision: 10,
				},
				files: {
					'dist/neon-bunny-snowflake-theme.css': 'src/**/*.scss',
				},
			},
			min: {
				options: {
					outputStyle: 'compressed',
					sourceMap: false,
					implementation: sass,
					precision: 10,
				},
				files: {
					'dist/neon-bunny-snowflake-theme.min.css': 'src/**/*.scss',
				},
			},
		},
		// -------------------------- POSTCSS //
		postcss: {
			options: {
				map: false,
				processors: [
					require('autoprefixer'),
				],
				syntax: require('postcss-scss'),
			},
			dist: {
				src: 'dist/neon-bunny-snowflake-theme.css',
			},
			min: {
				src: 'dist/neon-bunny-snowflake-theme.min.css',
			},
		},
		// -------------------------- Watch //
		watch: {
			options: {
				spawn: false,
			},
			all: {
				files: ['src/**/*.js', 'src/**/*.scss'],
				tasks: ['stylelint', 'sass', 'postcss', 'eslint', 'babel', 'uglify', 'usebanner', 'injectStyles', 'clean'],
			},
		},
	});

	// -------------------------- Register Inject Styles Task //
	grunt.registerTask('injectStyles', 'Replace Task', () => {
		const jsFilePath = './dist/neon-bunny-snowflake-theme.user.js';
		const stylesFilePath = './dist/neon-bunny-snowflake-theme.min.css';
		const fs = require('fs');
		const path = require('path');
		const util = require('util');
		let cssContent;

		fs.readFile(path.join(stylesFilePath), 'utf8', (err, data) => {
			if (err) {
				console.log('stylesFilePath readFile', err);
				process.exit(1);
			}

			cssContent = util.format(data);
			cssContent = cssContent.replace(/"/g, '\'');

			fs.readFile(jsFilePath, 'utf8', (error, jsData) => {
				if (error) {
					return console.log('jsFilePath readFile', error);
				}

				const result = jsData.replace(/INJECTED_STYLES/g, `${cssContent}`);

				fs.writeFile(jsFilePath, result, 'utf8', error2 => {
					if (error2) {
						return console.log('jsFilePath writeFile', error2);
					}

					return true;
				});

				grunt.task.run('clean');

				return true;
			});
		});
	});

	// -------------------------- Register Tasks //
	grunt.registerTask('default', ['watch']);
};
