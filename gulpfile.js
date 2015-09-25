var gulp = require("gulp");
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var gutil = require('gulp-util');
var shell = require('gulp-shell');

gulp.task('copy', function(){
  gulp.src(["src/**/*", "!src/{app,app/**,tests,tests/**,styles,styles/**}"])
    .pipe(gulp.dest('dist/'));
});

gulp.task('test', shell.task(['npm run-script test']))

gulp.task('webpack:build',  function(callback) {  
  var myConfig = Object.create(webpackConfig);
  
  webpack(myConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }

    if(stats.compilation.errors.length > 0){
        gutil.log('[webpack:build]', stats.compilation.errors.toString({ colors: true }));
        process.exit(1);
    }
          
    callback();

  });

});

gulp.task('default', ['copy','webpack:build']);
