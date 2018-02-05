const babel = require('gulp-babel'),
      browserSync = require('browser-sync').create(),
      concat = require('gulp-concat'),
      gulp = require('gulp'),
      notify = require ('gulp-notify'),
      rename = require("gulp-rename");


const sourcePath = './source/',
      buildPath = './docs/';


gulp.task('js:dev', () => {
  return  gulp.src([
                    sourcePath + 'js/DateSelector.js',
                    sourcePath + 'js/DateController.js',
                    sourcePath + 'js/Slider.js',
                    sourcePath + 'js/Calendar.js',
                    sourcePath + 'js/index.js',
                    ])
              .pipe( babel() )
              .on('error', notify.onError() )
              .pipe( concat('bundle.js') )
              .pipe(gulp.dest( buildPath + 'js/' ));
})


gulp.task('default', () => {
  browserSync.init({
    server: {
      baseDir: buildPath
    }
});

  gulp.watch( sourcePath + 'js/*.js', ['js:dev']);
  gulp.watch( buildPath + '**/*.*' ).on('change', browserSync.reload );
})
