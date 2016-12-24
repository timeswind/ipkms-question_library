var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

// add hot-reload related code to entry chunks
Object.keys(baseConfig.entry).forEach(function (name) {
  baseConfig.entry[name] = ['./build/dev-client'].concat(baseConfig.entry[name])
})

module.exports = merge(baseConfig, {
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  output: {
    // necessary for the html plugin to work properly
    // when serving the html from in-memory
    publicPath: '/'
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^\.\/package$/, function(result) {
      if(/cheerio/.test(result.context)) {
        result.request = "./package.json"
      }
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new LodashModuleReplacementPlugin,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
})
