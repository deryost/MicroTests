'use strict';
require('colors'); // get colors in your node.js console like what
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var notifier = require('node-notifier');
var plumber = require('gulp-plumber');
var beeper = require('beeper');
var filter = require('gulp-filter');


gulp.task('css', function () {
	gulp.src('./src/sass/**/*.scss')
		.pipe(plumber({errorHandler: handleErrors}))
		.pipe(filter(function(a){return a.stat && a.stat.size})) // be sure it's not an empty file
		.pipe(sass().on('error', sass.logError)) //{outputStyle: 'compressed'}
		.pipe(gulp.dest('./dist/css/'));

		beeper('*');
		var now = new Date();
		var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
		notifier.notify({'title': 'Gulp',	'message': 'sass compiled at ' + time});
});

gulp.task('copySrc', function () {
	gulp.src('./src/**/*.html')
		.pipe(plumber({errorHandler: handleErrors}))
		.pipe(gulp.dest('./dist/'));

		beeper('*');
		var now = new Date();
		var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
		notifier.notify({'title': 'Gulp',	'message': 'copySrc compiled at ' + time});
});


// Watch --------------------------------------------------------------------
gulp.task('watch', function () {
	watch('./src/sass/**/*.scss', function() {
		gulp.start('css');
	});
	watch(['./src/**/*.html'], function() {
		gulp.start('copySrc');
	});
});


// Plumber/Errors catch function --------------------------------------------------------------------
function handleErrors(err) {
	/*jshint validthis:true */
	var plugin = (err.plugin) ? "[" +err.plugin.toString().red + "] " : '';
	console.log(plugin + err.message.toString().bgRed);
	beeper('*-*');

	notifier.notify({
		'title': 'Oups',
		'message': plugin + err.message.toString()
	});

	this.emit('end');
}
