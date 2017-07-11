var path = require('path');
var webpack = require('webpack');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
//
// const extractLess = new ExtractTextPlugin({
//     filename: "styles.css",
//     disable: process.env.NODE_ENV === "development"
// });

module.exports = {
  entry: './javascript/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/assets/"
  },
  devtool: 'source-map',
  resolve: {
    modules: [
      path.resolve(__dirname, 'javascript'),
      path.resolve(__dirname, 'javascript', 'components'),
      path.resolve(__dirname, 'javascript', 'containers'),
      path.resolve(__dirname, 'javascript', 'store'),
      path.resolve(__dirname, 'javascript', 'utils'),
      path.resolve(__dirname, 'javascript', 'tests'),
      path.resolve(__dirname, 'node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react']
          }
        }
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "less-loader", options: { sourceMap: true } }
        ]
      },
      // {
      //   test: /\.less$/,
      //   use: extractLess.extract({
      //       use: [{
      //           loader: "css-loader"
      //       }, {
      //           loader: "less-loader"
      //       }],
      //       // use style-loader in development
      //       fallback: "style-loader"
      //   })
      // }
    ]
  },
  devServer: {
   compress: true,
   hot: true,
   noInfo: true,
   historyApiFallback: true,
   port: 9000
 },
 plugins: [
   new webpack.HotModuleReplacementPlugin(),
  //  extractLess
 ]
};
