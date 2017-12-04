const path = require('path')
const webpack = require('webpack')

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
      path.resolve(__dirname, 'node_modules')
    ],
    alias: {
        'react': 'preact-compat',
        'react-dom': 'preact-compat',
        // Not necessary unless you consume a module using `createClass`
        'create-react-class': 'preact-compat/lib/create-react-class'
    }
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
   new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
   new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
   new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
   new webpack.optimize.AggressiveMergingPlugin()
 ]
}
