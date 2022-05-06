const sass = require('sass');

module.exports = grunt => {
	require('load-grunt-tasks')(grunt);

	const packageJSON = grunt.file.readJSON('package.json');

	const banner = `
// ==UserScript==
// @name         Snowflake Neon Bunny Theme
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
					'.temp/snowflake-neon-bunny-theme.js': 'src/js/snowflake-neon-bunny-theme.js',
				},
			},
		},
		// -------------------------- ESLINT //
		eslint: {
			options: {
				configFile: '.eslintrc.js',
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
					'dist/snowflake-neon-bunny-theme.user.js': ['.temp/snowflake-neon-bunny-theme.js'],
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
					src: ['dist/snowflake-neon-bunny-theme.user.js'],
				},
			},
		},
		// ==================================================== Style Tasks //
		// -------------------------- SCSS //
		sass: {
			options: {
				implementation: sass,
				precision: 10,
			},
			dev: {
				options: {
					outputStyle: 'compressed',
					sourceMap: false,
					implementation: sass,
					precision: 10,
				},
				files: {
					'.temp/styles.css': 'src/**/*.scss',
				},
			},
		},
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
		// -------------------------- POSTCSS //
		postcss: {
			dev: {
				map: {
					inline: false,
				},
				src: '.temp/styles.css',
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
		const jsFilePath = './dist/snowflake-neon-bunny-theme.user.js';
		const stylesFilePath = '.temp/styles.css';
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

	// -------------------------- Load NPM Tasks//
	grunt.loadNpmTasks('gruntify-eslint');

	// -------------------------- Register Tasks //
	grunt.registerTask('default', ['watch']);
};
