var gulp = require('gulp');
var jsx = require('gulp-jsx');
var ext_replace = require('gulp-ext-replace');
var gulp_copy = require('gulp-copy');
var gulp_replace = require('gulp-replace');
var gulp_rjs = require('gulp-requirejs');
var template = require('gulp-template');

gulp.task('copy-base', function() {
    return gulp.src(['./**/*', '!**/*.jsx'], {
            cwd: './src/'
        })
        .pipe(gulp_copy('dist'));
});

gulp.task('html-template', ['copy-base'], function() {
    return gulp.src(['./index.html'], {
            cwd: './dist/'
        })
        .pipe(template({IN_PRODUCTION: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('compile-jsx', function() {

    var compileJsx = gulp.src('src/**/*.jsx')
        .pipe(jsx({
            factory: 'React.createElement',
            passUnknownTagsToFactory: true
        }))
        .pipe(ext_replace('.js'))
        .pipe(gulp.dest('dist'))
        .on('finish', function() {
            gulp.src('dist/**/*.js')
                .pipe(gulp_replace('require(\'jsx!', 'require(\''))
                .pipe(gulp_replace('require([\'jsx!', 'require([\''))
                .pipe(gulp_replace('requirejs(\'jsx!', 'requirejs(\''))
                .pipe(gulp_replace('requirejs([\'jsx!', 'requirejs([\''))
                .pipe(gulp.dest('dist'));
        });

    return compileJsx;
});


gulp.task('merge_requirejs', ['copy-base', 'compile-jsx'], function() {
    var requirejsdata = require('./src/requirejs.json');

    requirejsdata = JSON.stringify(requirejsdata).replace(/"vendor\//g, '"../bower_components/');
    requirejsdata = JSON.parse(requirejsdata);

    gulp_rjs({
            baseUrl: './dist/',
            name: '../bower_components/almond/almond',
            out: 'bundle.js',
            paths: requirejsdata.paths,
            shim: {
                // standard require.js shim options
            },
            wrap: true,
            insertRequire: ['app'],
            include: ['app']
        })
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['copy-base', 'compile-jsx', 'merge_requirejs', 'html-template']);
