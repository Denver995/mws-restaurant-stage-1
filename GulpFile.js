const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const imageminJpegtran = require('imagemin-jpegtran');

gulp.task('style', function(){
	gulp.src('./css/**/*.css').pipe(gulp.dest('./dist/css')).pipe(browserSync.stream());
});

gulp.task('copy-html', function() {
	gulp.src('./*.html').pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	gulp.src('./img/**/*.jpg').pipe(imagemin([
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5})])).pipe(gulp.dest('./dist/img'));
});

gulp.task('script-dist', function() {
	gulp.src('./js/**/*.js').pipe(concat('all.js')).pipe(uglify()).pipe(gulp.dest('./dist'));
});

gulp.task('script', function() {
	gulp.src('./js/**/*.js').pipe(concat('all.js')).pipe(gulp.dest('./dist'));
});

gulp.task('dist', [
	'style',
	'copy-html',
	'copy-images',
	'script-dist'
]);

gulp.task('default', ['style', 'copy-html', 'script', ], function () {
	gulp.watch('./index.html').on('change', browserSync.reload);
	gulp.watch('./*.html', ['copy-html']);
	gulp.watch('/restaurant.html').on('change', browserSync.reload);
	browserSync.init({
		server: './dist'
	});
});