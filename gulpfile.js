var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate')
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();

gulp.task('compress-html', function() {
  return gulp.src('www/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

gulp.task('compress-js', function() {
  return gulp.src('www/js/*.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('compress-libs-js', function() {
  return gulp.src('www/libs/*.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist/libs/'));
});

gulp.task('copy-data', function() {
    gulp.src('www/data/*')
    .pipe(gulp.dest('dist/data'));
});

gulp.task('watch-files', function() {
  gulp.watch('www/js/*.js',['compress-js']);
  gulp.watch('www/index.html',['compress-html']);
  gulp.watch('www/libs/*.js',['compress-libs-js']);
  gulp.watch('www/data/*',['copy-data']);
  gulp.watch('dist/*',['page-reload']);
  gulp.watch('dist/js/*',['page-reload']);
  gulp.watch('dist/libs/*',['page-reload']);
});

gulp.task('page-reload', function() {
  browserSync.reload();
})

gulp.task('browser-sync', ['compress-js','compress-html','copy-data','compress-libs-js','watch-files'], function() {
  browserSync.init({
      server: "dist/"
  });
  browserSync.stream();
});

gulp.task('default', ['browser-sync']);
