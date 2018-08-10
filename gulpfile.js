const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const lab = require('gulp-lab')

gulp.task('serve', function () {
  nodemon({
    script: 'index.js',
    ext: 'js json ejs',
    ignore: [
      'node_modules/',
      'test/',
      'tmp/',
      'gulpfile.js'
    ],
    env: {
      NODE_ENV: 'development'
    }
  })
})

gulp.task('test', function () {
  return gulp.src('test')
    .pipe(lab('-v -D -l -C'))
})

gulp.task('coverage', ['test'], function () {
  return gulp.src('test')
    .pipe(lab('-c -r html -o tmp/coverage.html'))
})

gulp.task('default', ['serve'])
