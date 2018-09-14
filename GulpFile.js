const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const imageminJpegtran = require('imagemin-jpegtran');


gulp.task('default', ['style', 'copy-images', 'script', 'copy-html'], function () {
	gulp.watch('sass/**/*.scss', ['style']);
	gulp.watch('./*.html', ['copy-html']);
	gulp.watch('./index.html').on('change', browserSync.reload);
	gulp.watch('./restaurant.html').on('change', browserSync.reload);
	browserSync.init({
		server: './dist'
	});
});

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('copy-html', function() {
	gulp.src('./*.html').pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	gulp.src('./img/*.jpg').pipe(imagemin([imagemin.jpegtran({progressive: true})])).pipe(gulp.dest('./dist/img'));
});

/*gulp.task('script-dist', function() {
	gulp.src('./js/*.js').pipe(concat('all.js')).pipe(uglify()).pipe(gulp.dest('./dist/js'))
});
*/

gulp.task('script', function() {
	gulp.src('./js/*.js').pipe(gulp.dest('./dist/js'));
	gulp.src('./sw.js').pipe(gulp.dest('./dist'));
});

gulp.task('dist', [
	'style',
	'copy-html',
	'copy-images',
	'script'
]);