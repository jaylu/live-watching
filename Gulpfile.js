var assets = require('postcss-assets');
var autoprefixer = require('autoprefixer-core');
var gulp = require('gulp');
var sass = require('gulp-sass');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var express = require('express');
var open = require('gulp-open');

var handleError = function (err) {
	console.log(err.name, ' in ', err.plugin, ': ', err.message);
	console.log(err);
};

gulp.task('sass', function () {
	var processors = [
		assets({
			basePath: 'source/',
			loadPaths: ['assets/fonts/', 'assets/images/']
		}),
		autoprefixer
	];

	return gulp.src(['source/sass/*.scss', '!source/sass/_*.scss'])
		.pipe(sass({
			outputStyle: 'compressed',
			errLogToConsole: false,
			onError: function(err) {
				handleError(err)
			}
		}))
		.pipe(postcss(processors).on('error', handleError))
		.pipe(gulp.dest('source/sass/.output'));
});

gulp.task('less', function () {
	return gulp.src('source/less/**/*.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(gulp.dest('./source/less/.output'))
});


gulp.task('watch', ['sass', 'less'], function () {

	gulp.watch('source/sass/**/*.scss', ['sass']);
	gulp.watch('source/less/**/*.less', ['less']);

	livereload.listen();
	gulp.watch([
		'source/css/**/*.css',
		'source/sass/.output/**/*.css',
		'source/less/.output/**/*.css',
		'source/index.html'
	]).on('change', livereload.changed);
});

gulp.task('server', ['watch'], function () {
	var port = 4000;
	var app = express();
	app.use(require('connect-livereload')());
	app.use(express.static('source'));
	app.listen(port);
	console.log('static server start on port:' + port);
});

gulp.task('open', ['server'], function () {

//    google-chrome' // Linux
//    'chrome' // Windows
//    'google chrome' // OSX
//    'firefox'

	var options = {
		url: 'http://localhost:4000',
		app: 'google chrome'
	};

	gulp.src('source/index.html')
		.pipe(open('', options));
});

gulp.task('default', ['open']);

