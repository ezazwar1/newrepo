module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-angular-gettext');

	grunt.initConfig({
		nggettext_extract: {
			pot: {
				files: {
					'languages/template.pot': [
						'src/*.html', 
						'src/*/*.html', 
						'src/*/*/*.html', 
						'src/*/*/*/*.html', 
						'src/*/*/*/*/*.html', 
						'src/*.js',
						'src/*/*.js', 
						'src/*/*/*.js', 
						'src/*/*/*/*.js', 
						'src/*/*/*/*/*.js'
					]
				}
			}
		},
		nggettext_compile: {
			all: {

				files: {
					'languages/translations.js': ['languages/*.po']
				}
			}
		}
	})

};