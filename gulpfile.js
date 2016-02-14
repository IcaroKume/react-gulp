var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browseify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var path = require('path');
var server = require('gulp-server-livereload');

gulp.task('build', function() { // default, just gulp
    var bundler = watchify(browseify({
        entries: ['./src/app.jsx'],
        extensions: ['.jsx'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    })
    .transform(babelify.configure({
            sourceMapRelative: path.resolve(__dirname, 'src'),
            presets: ["es2015", "react"]
        }))
    );

    function build(file) {
        if(file) gutil.log('Recompiling ' + file);
        return bundler
            .bundle()
            .on('error', gutil.log.bind(gutil, 'Browseify Error'))
            .pipe(source('main.js'))
            .pipe(gulp.dest('./'));
    };

    build();
    bundler.on('update', build);

    return
});

gulp.task('serve', function(done) {
  gulp.src('')
    .pipe(server({
      livereload: {
        enable: true,
        filter: function(filePath, cb) {
          if(/main.js/.test(filePath)) {
            cb(true)
          } else if(/style.css/.test(filePath)){
            cb(true)
          }
        }
      },
      open: true
    }));
});

gulp.task('default', ['build', 'serve']);
