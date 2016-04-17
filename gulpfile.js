var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename =  require('gulp-rename');

gulp.task('uglify', () => {
    gulp.src('./es6-hasher.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({suffix:'.min', prefix:'babel.', basename: "es5-hasher"}))
        .pipe(gulp.dest('./dist'));
});
