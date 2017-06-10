let transform = [
    [
        "babelify",
        {
            "presets": [
                "es2015"
            ],
            "plugins": [
                "add-module-exports", // to ensure dist files are exported without the "default" property
                "transform-object-assign",
            ]
        }
    ]
];

module.exports = {
    build: {
        files: {
            'dist/modal.js': ['src/modal.js']
        },
        browserifyOptions: {
            standalone: 'Modal',
            transform
        },
        minifyFiles:{
            'dist/modal-min.js': ['dist/modal.js']
        },
        bannerFiles: ['dist/*']
    },
    tests: {
        mocha: {
            files: ['tests/*.js'],
            transform
        }
    }
};

