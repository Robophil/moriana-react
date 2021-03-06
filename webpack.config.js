const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './javascript/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/"
  },
  devtool: 'source-map',
  resolve: {
    modules: [
      path.resolve(__dirname, 'javascript'),
      path.resolve(__dirname, 'node_modules')
    ]
    // alias: {
    //   'react': 'preact-compat',
    //   'react-dom': 'preact-compat'
    // }
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
      //   // set up standard-loader as a preloader
      //   enforce: 'pre',
      //   test: /\.js?$/,
      //   loader: 'standard-loader',
      //   exclude: /(node_modules)/,
      //   options: {
      //     // Emit errors instead of warnings (default = false)
      //     error: false,
      //     // enable snazzy output (default = true)
      //     snazzy: true,
      //     // other config options to be passed through to standard e.g.
      //     parser: 'babel-eslint'
      //   }
      // }
    ]
  },
  devServer: {
   compress: true,
   hot: true,
  //  noInfo: true,
   historyApiFallback: true,
   port: 9000,
  //  quiet: true,
   clientLogLevel: 'none'
 },
 plugins: [
   new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
   new webpack.HotModuleReplacementPlugin()
 ]
}
