const { src, dest , watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))

function buildStyles() {
    return src('./assets/scss/index.scss')
        .pipe(sass())
        .pipe(dest('scss'))
}

function watchTask() {
    watch(['index.scss'])
}

exports.default = series(buildStyles, watchTask)