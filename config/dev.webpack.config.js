const path = require('path'),
      merge = require('webpack-merge'),
      webpack = require("webpack");

module.exports = function(baseWebpackConfig){
  Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = [path.resolve('core/dev-client')].concat(baseWebpackConfig.entry[name]);
  })

  return merge(baseWebpackConfig,{
    devtool: '#cheap-module-eval-source-map',
    plugins:[
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}
