'use strict';
module.exports = {
    build: {
        production: {
            dist: 'dist',
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
        }
    },
    tests: {
        mocha: {
            src: ['tests/*.js']
        }
    }
};
