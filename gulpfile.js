var gulp         = require('gulp'),
    pug          = require('gulp-pug'),
    sass         = require('gulp-sass'),
    notify       = require("gulp-notify"),
    sourcemaps   = require('gulp-sourcemaps'),
    spritesmith  = require('gulp.spritesmith'),
    del        = require('del'),
    rename       = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync').create();




/* -------- Server  -------- */
gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* ------------ Pug compile ------------- */
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('src/template/*.pug')
    .pipe(pug({pretty: true }))
    .on('error', notify.onError(function(error) {
      return {
        title: 'Pug',
        message: error.message
      }
    }))
    .pipe(gulp.dest('build'));
});

/* ------------ Styles compile ------------- */
gulp.task('styles:compile', function () {
  return gulp.src('src/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'));
});

/* ------------ Sprite ------------- */
gulp.task('sprite', function(cb) {
  var spriteData = gulp.src('./src/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('./build/images/'));
  spriteData.css.pipe(gulp.dest('./src/styles/sprite/'));
  cb();
});

/* ------------ Delete ------------- */
gulp.task('clean', function(cb) {
  return del('build', cb);
});

/* ------------ Copy fonts ------------- */
gulp.task('copy:fonts', function() {
  return gulp.src('./src/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/* ------------ Copy images ------------- */
gulp.task('copy:images', function() {
  return gulp.src('./src/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/* ------------ Copy ------------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* ------------ Watchers ------------- */
gulp.task('watch', function() {
  gulp.watch('src/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('src/styles/**/*.scss', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
  )
);
