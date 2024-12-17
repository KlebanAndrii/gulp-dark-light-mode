// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Use dart-sass for @use
// sass.compiler = require('dart-sass');

// HTML Task
function htmlTask() {
  return src('*.html') // Вибирає всі HTML-файли в кореневій папці
    .pipe(dest('dist')); // Копіює їх у папку dist
}

// Static Images Task
function imagesTask() {
  return src('images/**/*') // Вибирає всі файли в папці images
    .pipe(dest('dist')); // Копіює їх у папку dist
}



// Sass Task
function scssTask() {
  return src('app/scss/style.scss', { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', series(htmlTask, browserSyncReload));
  // watch('*.html', browserSyncReload);
  watch('images/**/*', series(imagesTask, browserSyncReload));
  watch(['app/scss/**/*.scss', 'app/**/*.js'], series(scssTask, jsTask, browserSyncReload));
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, htmlTask, imagesTask, browserSyncServe, watchTask);