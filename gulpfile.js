/* jshint -W097 */

/*
    TODO:
    - build flag to disable sourcemaps.
    - build flag to disable linting.
    - seperate js build for vendor files.
 */

'use strict';

var gulp = require('gulp');
// Makes linting reports more readable.
var stylish = require('jshint-stylish');
// This scopes all plugins as methods of `gp` without the 'gulp-' prefix.
// e.g. call 'gulp-ruby-sass' as gp.rubySass.
var gp = require('gulp-load-plugins')();
// Browsers we want to support with css prefixes.
var prefixBrowsers = [
    '> 1%',
    'last 2 versions',
    'Firefox ESR',
    'Opera 12.1',
    'Android >= 4.1',
    'ie 9',
    'ie 8'
];

// Lint all our js files using local `.jshirtrc` file.
// More info @http://jshint.com/docs/options/
gulp.task('lint', function () {
    return gulp.src('src/js/*.js')
        .pipe(gp.jshint())
        .pipe(gp.jshint.reporter(stylish))
        .pipe(gp.jshint.reporter('fail'));
});

// Lint all js files, then combine/minify them. If there are linting errors files will not combine.
gulp.task('scripts', ['lint'], function () {
    return gulp.src('src/js/*.js')
        .pipe(gp.sourcemaps.init())
            .pipe(gp.concat('scripts.min.js'))
            .pipe(gp.uglify())
        .pipe(gp.sourcemaps.write())
        .pipe(gulp.dest('js'));
});

// Compile minified sass files and add css prefixes.
gulp.task('styles', function () {
    return gp.rubySass('src/sass/', { sourcemap: true, style: 'compact' })
        .on('error', function (err) { console.error('Error!', err.message); })
        .pipe(gp.sourcemaps.write())
        // .pipe(gp.autoprefixer({ browsers: prefixBrowsers }))
        // .pipe(gp.sourcemaps.write())
        .pipe(gulp.dest(''));
});

// Watch for file changes and automatically run respective tasks.
// Note: If 'scripts' fails due to linting errors, watch will continue to run without building scripts.
gulp.task('watch', function () {
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch(['src/sass/*.scss', 'src/sass/*/*.scss'], ['styles']);
});

// build all files by just running `gulp`.
gulp.task('default', ['scripts', 'styles']);