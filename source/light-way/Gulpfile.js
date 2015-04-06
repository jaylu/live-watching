var gulp = require('gulp');
var livereload = require('gulp-livereload');
var express = require('express');
var open = require('gulp-open');

var handleError = function (err) {
	console.log(err.name, ' in ', err.plugin, ': ', err.message);
	console.log(err);
};

var webRoot = './';
var watchFiles = [
		'**/*.html',
		'**/*.css'
	];
var indexFile = './index.html';
var url = 'http://localhost:4000';

gulp.task('watch', function () {

	livereload.listen();
	gulp.watch(watchFiles).on('change', livereload.changed);
});

gulp.task('server', ['watch'], function () {
	var port = 4000;
	var app = express();
	app.use(require('connect-livereload')());
	app.use(express.static(webRoot));
	app.listen(port);
	console.log('static server start on port:' + port);
});

gulp.task('open', ['server'], function () {

	var options = {
		url: url,
		app: 'google chrome'
	};

	gulp.src(indexFile)
		.pipe(open('', options));
});

gulp.task('default', ['open']);

