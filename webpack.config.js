import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

let babelSettings = {
  presets: ['es2015']
};

module.exports = {
  cache: true,

  entry: path.resolve("./src/app.js"),

  output: {
    path: path.resolve("./dist"),
    publicPath: "/dist/",
    filename: "bundle.js",
    chunkFilename: "[chunkhash].js"
  },

  module: {
    loaders: [
      {
        test: /\.html$/,
        loaders: ["html"]
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: babelSettings
      }
    ]
  },
  resolve: {
    root: [path.resolve("./bower_components")]
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new HtmlWebpackPlugin({
      title: 'Vector'
    })
  ]

};
