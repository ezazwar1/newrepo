module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        e2eConfig: {
            basePath: 'coverage/e2e',
            instrumentedPath: 'coverage/e2e/instrumented/stylecheck',
            reportPath: 'coverage/e2e/reports'
        },

        clean: {
            build: {
                src: ['build/resources/scss', 'build/resources/css/ionic', 'build/app/spec']
            },
            coverageE2E: {
                src: ['<%= e2eConfig.basePath %>/']
            },
            distUnitTests: {
                src: ['coverage/unit/reports']
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: ['resources/css/**', 'resources/icons/**', 'resources/fonts/**', 'resources/img/**', 'resources/splash/**', 'app/templates/**', 'config.xml'],
                        dest: 'build/'
                    }
                ]
            },
            coverageE2E: {
                files: [{
                    expand: true,
                    dest: '<%= e2eConfig.instrumentedPath %>',
                    src: [
                        'index.html',
                        '*.{ico,png,txt}',
                        'resources/**/*',
                        'app/templates/**/*',
                        'lib/**/*'
                    ]
                }]
            }
        },

        shell: {
            startKarmaTests: {
                command: [
                    './node_modules/.bin/karma start karma.conf.js'
                ]
            },
            e2e: {
                command: 'protractor protractor.conf.js'
            },
            e2eWin: {
                command: 'protractor protractor.winconf.js'
            },
            startSelenium: {
                command: 'node node_modules/protractor/bin/webdriver-manager start'
            }
        },

        requirejs: {
            compile: {
                options: {
                    name: '../lib/requirejs/almond',
                    include: ['boot', 'dicts/de', 'dicts/en'],
                    out: 'build/app.js',
                    baseUrl: 'app/',
                    mainConfigFile: 'app/main.js',
                    optimize: "uglify2",
                    insertRequire: ['boot'],
                    wrap: true
                }
            }
        },

        replace: {
            buildIndex: {
                src: ['index.html'],
                dest: ['build/index.html'],
                replacements: [{
                    from: '<script src="app/main"></script>',
                    to: ''
                }, {
                    from: '<script src="lib/requirejs/requirejs.min.js"></script>',
                    to: ''
                }, {
                    from: '<script src="app/boot.js"></script>',
                    to: ''
                }, {
                    from: '<!--<script src="build/app.js" type="text/javascript"></script>-->',
                    to: '<script src="app.js" type="text/javascript"></script>'
                }]
            }
        },

        compass: {
            build: {
                options: {
                    sassDir: 'build/resources/scss/',
                    cssDir: 'build/resources/css'
                }
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'build/resources/css/',
                src: ['app.css'],
                dest: 'build/resources/css/',
                ext: '.css'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'build/resources/splash',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'build/resources/splash/'
                }]
            }
        },

        ngmin: {
            controllers: {
                expand: true,
                cwd: 'build/app/',
                src: ['build/js/*.js'],
                dest: 'build/app/'
            },
            directives: {
                expand: true,
                cwd: 'build/app/',
                src: ['directives.js'],
                dest: 'build/app/'
            },
            factories: {
                expand: true,
                cwd: 'build/app/',
                src: ['factories.js'],
                dest: 'build/app/'
            }
        },

        uglify: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/app/',
                        src: ['build/js/*.js'],
                        dest: 'build/app/',
                        ext: '.js',
                        extDot: 'first'
                    },
                    {
                        expand: true,
                        cwd: 'build/app/',
                        src: ['directives.js'],
                        dest: 'build/app/',
                        ext: '.js',
                        extDot: 'first'
                    },
                    {
                        expand: true,
                        cwd: 'build/app/',
                        src: ['factories.js'],
                        dest: 'build/app/',
                        ext: '.js',
                        extDot: 'first'
                    }
                ]
            }
        },

        protractor: {
            options: {
                keepAlive: true,
                noColor: false,
                //debug: true,
                args: {
                    specs: [
                        //'app/spec/e2e/Controller/Dashboard/*.js',
                        'app/spec/e2e/Controller/Settings/*.js',
                        // 'app/spec/e2e/Controller/Styles/*.js',
                        // 'app/spec/e2e/Controller/Unauthorized/*.js',
                        // 'app/spec/e2e/Controller/User/*.js',
                        // 'app/spec/e2e/Controller/Styles/Detail.js',
                        // 'app/spec/e2e/Controller/Unauthorized/Login.js',
                        // 'app/spec/e2e/Controller/Unauthorized/Registration.js',
                        // 'app/spec/e2e/Controller/User/AccountSettings.js',
                        // 'app/spec/e2e/Controller/User/EditProfile.js',
                        // 'app/spec/e2e/Controller/User/FilterSettings.js',
                        // 'app/spec/e2e/Controller/User/OwnStyles.js',
                        // 'app/spec/e2e/Controller/User/ProfileFavorites.js',
                        // 'app/spec/e2e/Controller/User/ProfileFollowers.js',
                        // 'app/spec/e2e/Controller/User/Search.js',
                        // 'app/spec/util/reporter-hack.js'
                    ]
                }

            },
            linux: {
                options: {
                    configFile: 'protractor.conf.js'
                },
                args: {
                    specs: [
                        'app/spec/e2e/Controller/Unauthorized/Login.js'
                    ]
                }
            },
            windows: {
                options: {
                    configFile: 'protractor.winconf.js'
                }
            }
        },

        karma: {
            options: {
                configFile: 'karma.conf.js',
                basePath: '',
                frameworks: ['jasmine', 'requirejs'],
                preprocessors: {
                    'app/templates/**/*.html': ['ng-html2js']
                },
                ngHtml2JsPreprocessor: {
                    stripPrefix: 'app',
                    prependPrefix: '/assets'
                }
                //background: false
            },
            dist: {
                singleRun: true,
                browsers: ['PhantomJS'],
                preprocessors: {
                    'app/services/*.js': ['coverage'],
                    'app/directives/*.js': ['coverage']
                },
                reporters: ['dots', 'junit', 'coverage'],
                coverageReporter: {
                    //type : 'cobertura',
                    type: 'lcov',
                    dir: 'coverage/unit/reports/'
                },
                junitReporter: {
                    outputFile: 'app/spec/unit/log/unit-test-results.xml'
                }
            },
            dev: {
                autoWatch: true,
                browsers: ['Chrome']
            }
        },

        //Istanbul
        instrument: {
            files: ['app/**/*.js'],
            options: {
                lazy: true,
                basePath: '<%= e2eConfig.instrumentedPath %>/'
            }
        },

        protractor_coverage: {
            options: {
                // Task-specific options go here.
                //WIN
                configFile: 'protractor.winconf.js',
                //Linux
                //configFile: 'protractor.conf.js',
                keepAlive: true,
                noColor: false,
                //collectorPort: 3001,
                coverageDir: '<%= e2eConfig.instrumentedPath %>',
                args: {
                    baseUrl: 'http://192.168.56.102/dev/stylecheck/<%= e2eConfig.instrumentedPath %>',
                    specs: [
                        'app/spec/e2e/Controller/Dashboard/*.js',
                        'app/spec/e2e/Controller/Settings/*.js',
                        'app/spec/e2e/Controller/Styles/*.js',
                        'app/spec/e2e/Controller/Unauthorized/*.js',
                        'app/spec/e2e/Controller/User/*.js',
                        'app/spec/util/reporter-hack.js'
                    ]
                }
            },
            local: {
                options: {
                    'browser': 'chrome'
                }
            }
        },

        makeReport: {
            src: '<%= e2eConfig.instrumentedPath %>/*.json',
            options: {
                type: 'lcov',
                dir: '<%= e2eConfig.reportPath %>',
                print: 'detail'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "requirejs" task.
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Load the plugin that provides the replace task.
    grunt.loadNpmTasks('grunt-text-replace');

    // Load plugin that provides copy
    grunt.loadNpmTasks('grunt-contrib-copy');

    //Load plugin that provides ngmin
    grunt.loadNpmTasks('grunt-ngmin');

    // Load plugin to compile scss to css
    grunt.loadNpmTasks('grunt-contrib-compass');

    // Load plugin to remove files
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Load plugin to minify css
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Load plugin to compress images
    //grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Load plugin to execute shell commands
    grunt.loadNpmTasks('grunt-shell');

    // Load plugin to use protractor
    grunt.loadNpmTasks('grunt-protractor-runner');

    // Load plugin to run Karma tests
    grunt.loadNpmTasks('grunt-karma');

    // Load plugin to run protractor-coverage
    grunt.loadNpmTasks('grunt-protractor-coverage');

    // Load plugin to run istanbul
    grunt.loadNpmTasks('grunt-istanbul');

    // Build tasks
    grunt.registerTask('build', ['copy', 'cssmin', 'ngmin', 'uglify', 'concat', 'clean']);
    grunt.registerTask('newBuild', ['copy', 'requirejs', 'replace:buildIndex']);

    // Test tasks
    //grunt.registerTask('e2eWin', ['shell:e2eWin']);
    grunt.registerTask('e2e', ['shell:e2e']);
    grunt.registerTask('devUnitTests', ['karma:dev']);
    grunt.registerTask('distUnitTests', [ 'clean:distUnitTests', 'karma:dist']);
    grunt.registerTask('startSelenium', [
        'shell:startSelenium'
    ]);
    grunt.registerTask('e2eWin', [
        'protractor:windows'
    ]);
    grunt.registerTask('e2eLinux', [
        'protractor:linux'
    ]);
    grunt.registerTask('coverageE2E', [
        'clean:coverageE2E',
        'copy:coverageE2E',
        'instrument',
        'protractor_coverage',
        'makeReport'
    ]);

};
