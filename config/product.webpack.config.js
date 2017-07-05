const merge = require('webpack-merge'),
      webpack = require("webpack");

module.exports = function(baseWebpackConfig){
  return merge(baseWebpackConfig,{
    devtool:false,
    plugins:[

      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false  // remove all comments
        },
        compress: {
          warnings: false
        },
        sourceMap:true
      }),
      new webpack.LoaderOptionsPlugin({
          minimize: true
      })
    ]
  });
}
