'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var strip = require('gulp-strip-comments');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

var reload = browserSync.reload;

gulp.task("copyfiles", function () {
  // Babel
  gulp.src("vendor/bower_components/babel/browser.js")
    .pipe(gulp.dest("source/js/babel"));

  // React
  gulp.src("vendor/bower_components/react/react.js")
    .pipe(gulp.dest("source/js/react"));
  gulp.src("vendor/bower_components/react/react-dom.js")
    .pipe(gulp.dest("source/js/react"));

// jQuery
  gulp.src("vendor/bower_components/jquery/dist/jquery.js")
    .pipe(gulp.dest("source/js/jquery"));

// Bootstrap
  gulp.src("vendor/bower_components/bootstrap-sass/assets/stylesheets/**")
    .pipe(gulp.dest("source/sass/bootstrap"));
  gulp.src("vendor/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js")
    .pipe(gulp.dest("source/js/bootstrap"));
  gulp.src("vendor/bower_components/bootstrap-sass/assets/fonts/**")
    .pipe(gulp.dest("public/fonts"));
});

gulp.task('clean', function (cb) {
	del([
		'source/css/**/*',
        'source/js/**/*',
        'source/sass/**/*',
        '!source/sass/*.scss',
	], cb);
});

gulp.task('scripts', function () {
	// Merge scripts here
    return gulp.src([
        "source/js/babel/browser.js",
        "source/js/react/react.js",
        "source/js/react/react-dom.js",
        "source/js/jquery/jquery.js",
        "source/js/bootstrap/bootstrap.js"
    ])
    .pipe(concat("libs.js"))
    .pipe(gulp.dest("public/js"));
});

gulp.task('sass', function () {
	return gulp.src('source/sass/style.scss')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer("last 10 versions"))
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/css'));
});

gulp.task('css', function () {
	// Run css concat or minify here
});

gulp.task('watch', function () {
	gulp.watch([
		'source/sass/style.scss',
		'source/sass/responsive.scss'
	], ['sass']);
});

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    browser: "google chrome",
    port: 7000
  });
});

gulp.task('browser-sync-delay', function () {
  setTimeout(function() {
    browserSync.reload({ stream: false });
  }, 1000);
});

gulp.task('nodemon', function (cb) {
  var started = false;

  return nodemon({
    script: 'server/server.js'
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('default', ['sass', 'browser-sync'], function () {
  gulp.watch("public/**/*.html", browserSync.reload);
  gulp.watch("public/css/**/*.css", browserSync.reload);
  gulp.watch("public/js/**/*.js", browserSync.reload);
  gulp.watch("server/**/*.js", ['browser-sync-delay']);
  gulp.watch("source/sass/*.scss", ['sass']);
});
