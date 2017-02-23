var gulp = require('gulp');
var sass = require('gulp-sass');
//var useref = require('gulp-useref');
//var postcss = require('gulp-postcss');
//var autoprefixer = require('autoprefixer');
//var cleanCSS = require('gulp-clean-css');
//var uglify = require('gulp-uglify');
//var pump = require('pump');
//var imagemin = require('gulp-imagemin');

gulp.task('sass', function(){
   return gulp.src('client/css/scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('client/css'));
});

gulp.task('watch', function(){
    gulp.watch('client/css/scss/*.scss', ['sass']);
});

//gulp.task('useref', function(){
//    return gulp.src('dev/*.html')
//        .pipe(useref())
//        .pipe(gulp.dest('prod'));
//});

//gulp.task('autoprefixer', function () {
//    return gulp.src('prod/css/style.css')
//        .pipe(postcss([ autoprefixer() ]))
//        .pipe(gulp.dest('prod/css'));
//});
//
//gulp.task('minify-css', function() {
//  return gulp.src('prod/css/style.css')
//    .pipe(cleanCSS({compatibility: 'ie8'}))
//    .pipe(gulp.dest('prod/css'));
//});
//
//gulp.task('compress', function (cb) {
//  pump([
//        gulp.src('dev/js/app.js'),
//        uglify(),
//        gulp.dest('prod/js')
//    ],
//    cb
//  );
//});
//
//gulp.task('images',function(){
//    return gulp.src('dev/images/**/*.+(png|jpg|gif|svg)')
//        .pipe(imagemin())
//        .pipe(gulp.dest('prod/images'));
//});
