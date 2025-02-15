const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');

gulp.task('clean-css', () => {
  return gulp.src('src/styles.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});
