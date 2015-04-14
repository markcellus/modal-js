'use strict';
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bt: {
            dist: 'dist',
            build: {
                files: {
                    'dist/modal.js': ['src/modal.js']
                },
                browserifyOptions: {
                    standalone: 'Modal'
                }
            },
            min: {
                files: {
                    'dist/modal-min.js': ['dist/modal.js']
                }
            },
            banner: {
                files: ['dist/*']
            },
            tests: {
                mocha: {
                    src: ['tests/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('build-tools');
};