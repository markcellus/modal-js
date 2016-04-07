'use strict';
module.exports = {
    dist: 'dist',
    build: {
        files: {
            'dist/modal.js': ['src/modal.js']
        },
        browserifyOptions: {
            standalone: 'Modal'
        },
        minifyFiles: {
            'dist/modal-min.js': ['dist/modal.js']
        },
        bannerFiles: ['dist/*']
    },
    tests: {
        mocha: {
            src: ['tests/*.js']
        }
    }
};
