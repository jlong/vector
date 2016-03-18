import path from 'path';
import webpack from 'webpack';

module.exports = {
  cache: true,

  entry: path.resolve("./src/app.js"),

  output: {
    path: path.resolve("./dist"),
    publicPath: "dist/",
    filename: "bundle.js",
    chunkFilename: "[chunkhash].js"
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      // Automtically detect jQuery and $ as free var in modules
      // and inject the jquery library
      // This is required by many jquery plugins
      jQuery: "jquery",
      $: "jquery"
    })
  ]
};
