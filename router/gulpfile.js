var gulp = require('gulp');
var jsx = require('gulp-jsx');
var ext_replace = require('gulp-ext-replace');
var gulp_copy = require('gulp-copy');
var gulp_replace = require('gulp-replace');

gulp.task('copy-base', function() {
    return gulp.src(['./**/*', '!**/*.jsx'], {
            cwd: './public/'
        })
        .pipe(gulp_copy('dist'));
});

gulp.task('compile-jsx', function() {

    var compileJsx = gulp.src('public/**/*.jsx')
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

gulp.task('default', ['copy-base', 'compile-jsx']);
