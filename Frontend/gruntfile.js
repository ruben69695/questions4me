
module.exports = function (grunt) {
    require("time-grunt")(grunt);
    require("jit-grunt")(grunt, {
        useminPrepare: "grunt-usemin"
    });

    // Important to use grunt uglify with js code in Ecmascript 6
    // npm install grunt-contrib-uglify-es --save-dev
    grunt.loadNpmTasks('grunt-contrib-uglify-es');

    grunt.initConfig({
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "src/scss/",
                    src: ["*.scss"],
                    dest: "src/css",
                    ext: ".css"
                }]
            }
        },
        watch: {
            scripts: {
                files: [
                    "src/scss/*.scss",
                ],
                tasks: [
                    "css",
                ],
                options: {
                    spawn: false
                }
            }
        },
        browserSync: {
            dev: {
                bsFiles: {  // browser files
                    src: [
                        "src/index.html",
                        "src/questions.html",
                        "src/css/*.*",
                        "src/scss/*.*",
                        "src/js/*.js",
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: ["./", "./src"], // Directorio base dónde corre el servidor
                    }
                }
            }
        },
        copy: {
            html: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: "./src/",
                        src: "*.html",
                        dest: "dist"
                    },
                ]
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: "node_modules/@fortawesome/fontawesome-free/webfonts/",
                        src: "*.*",
                        dest: "dist/webfonts"
                    },
                ]
            },
            audios: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: "./src/",
                        src: "audio/*.*",
                        dest: "dist"
                    }
                ]
            }
        },
        clean: {
            build: {
                src: [
                    "./dist/",
                ]
            }
        },
        cssmin: {
            target: {
                options: {
                    mergeIntoShorthands: false,
                    roundingPrecision: -1
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src/css',
                        src: ['*.css', '!*.min.css'],
                        dest: 'dist/css',
                        ext: '.min.css'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/css/',
                        src: ['bootstrap.min.css'],
                        dest: 'dist/css',
                        ext: '.min.css'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/@fortawesome/fontawesome-free/css/',
                        src: ['all.min.css'],
                        dest: 'dist/css',
                        ext: '.min.css'
                    }
                ]
            }
        },

        uglify: {
            my_target: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js',
                        src: '**/*.js',
                        dest: 'dist/js',
                        ext: '.min.js'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/jquery/dist/',
                        src: 'jquery.min.js',
                        dest: 'dist/js'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/popper.js/dist/umd/',
                        src: 'popper.min.js',
                        dest: 'dist/js'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/js/',
                        src: 'bootstrap.min.js',
                        dest: 'dist/js'
                    }
                ]
              }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: "dist",
                        src: ["*.html"],
                        dest: "dist"
                    },
                ]
            }
        },
        filerev: {
            options: {
                encoding: "utf8",
                algorithm: "md5",
                length: 20
            },
            release: {
                files: [
                    {
                        src: [
                            "dist/js/*.js",
                            "dist/css/*.css",
                        ]
                    }
                ]
            }
        },
        concat: {
            options: {
                separator: ";"
            },
            dist: {}
        },
        useminPrepare: {
            html: {
                dest: "dist",
                src: [
                    "index.html",
                    "questions.html",
                ]
            },
            options: {
                flow: {
                    steps: {
                        css: [
                            "cssmin",
                        ],
                        js: [
                            "uglify",
                        ]
                    },
                    post: {
                        css: [
                            {
                                name: "cssmin",
                                createConfig: function(context, block) {
                                    var generated = context.options.generated;
                                    generated.options = {
                                        keepSpecialComments: 0,
                                        rebase: false
                                    }
                                }
                            },
                        ]
                    }
                }
            }
        },
        usemin: {
            html: [
                "dist/index.html",
                "dist/questions.html",
            ],
            options: {
                assetsDir: [
                    "dist",
                    "dist/css",
                    "dist/js",
                ]
            }
        }
    });

    // Register Tasks
    grunt.registerTask("css", ["sass"]);
    grunt.registerTask("default", ["browserSync", "watch"]);
    grunt.registerTask("build", [
        "clean",
        "copy",
        "useminPrepare",
        "concat",
        "cssmin",
        "uglify",
        "filerev",
        "usemin",
        "htmlmin"
    ]);
};