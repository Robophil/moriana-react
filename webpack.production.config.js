var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  entry: './javascript/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'cheap-module-source-map',
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
          { loader: "css-loader", options: { sourceMap: false } },
          { loader: "less-loader", options: { sourceMap: false } }
        ]
      }
    ]
  },
 plugins: [
   new webpack.DefinePlugin({
     'process.env': {
       'NODE_ENV': JSON.stringify('production')
     }
   }),
   new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
   new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  //  new webpack.optimize.CommonsChunkPlugin('common'),
   new webpack.optimize.AggressiveMergingPlugin()
   new CompressionPlugin({
     asset: "[path].gz[query]",
     algorithm: "gzip",
     test: /\.js$|\.css$|\.html$/,
     threshold: 10240,
     minRatio: 0.8
   })
 ]
}
