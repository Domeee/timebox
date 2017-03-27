const gulp = require('gulp');
const path = require('path');
const del = require('del');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const csso = require('gulp-csso');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

const dist = 'dist';

gulp.task('clean', () => {
  return del(path.join(dist, '*'), {
    force: true
  });
});

gulp.task('index', () => {
  return gulp.src('app/index.html')
    .pipe(gulp.dest(dist));
});

gulp.task('static', () => {
  return gulp.src('app/static/**/*')
    .pipe(gulp.dest(dist));
});

gulp.task('scripts', () => {
  return gulp.src('app/app.js')
    .pipe(gulp.dest(dist));
});

gulp.task('styles', () => {
  return gulp.src('app/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    // .pipe(concat('app.min.css'))
    .pipe(csso())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dist));
});

gulp.task('watch', function (cb) {
  gulp.watch('app/index.html', ['index', browserSync.reload]);
  gulp.watch('app/static/**/*', ['static', browserSync.reload]);
  gulp.watch('app/styles/**/*.scss', ['styles', browserSync.reload]);
  gulp.watch('app/app.js', ['scripts', browserSync.reload]);
  cb();
});

gulp.task('serve', () => {
  browserSync({
    port: 8080,
    open: false,
    server: {
      baseDir: dist
    }
  });
});

gulp.task('default', ['clean', 'index', 'static', 'scripts', 'styles', 'serve', 'watch']);