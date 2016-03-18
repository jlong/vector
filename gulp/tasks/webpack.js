import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import webpackConfig from '../../webpack.config.js';
import WebpackDevServer from 'webpack-dev-server';
import lodash from 'lodash';


gulp.task('webpack', function(callback) {
  webpack(webpackConfig, function(err, stats) {
    if (err) { throw new gutil.PluginError("webpack", err); }
    gutil.log("[webpack]", stats.toString({ colors: true }));
    callback();
  });
});


gulp.task("webpack:build", function(callback) {
	var config = Object.assign({}, webpackConfig, {
    plugins: webpackConfig.plugins.concat(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
    )
  });
	webpack(config, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({ colors: true }));
		callback();
	});
});


// Use a single instance of the compiler for dev-build to allow caching
var devCompiler, devConfig;

gulp.task("webpack:dev-build", function(callback) {
  if (!devCompiler) {
    devCompiler = webpack(Object.assign({}, webpackConfig, {
      devtool: "sourcemap",
      debug: true
    }));
  }
	devCompiler.run(function(err, stats) {
		if (err) { throw new gutil.PluginError("webpack:build-dev", err); }
		gutil.log("[webpack:dev-build]", stats.toString({ colors: true }));
		callback();
	});
});


gulp.task("webpack:server", function(callback) {
  var config = Object.assign({}, webpackConfig, {
    devtool: "sourcemap",
    debug: true
  });
  new WebpackDevServer(webpack(config), {
    publicPath: "/" + config.output.publicPath,
    stats: { colors: true }
  }).listen(8080, "localhost", function(err) {
    if(err) { throw new gutil.PluginError("webpack-dev-server", err); }
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    callback();
  });
});

gulp.task("serve", ["webpack:server"]);
