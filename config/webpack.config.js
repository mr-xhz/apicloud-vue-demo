const fs = require('fs'),
      path = require('path'),
      webpack = require("webpack"),
      merge = require('webpack-merge'),
      ExtractTextPlugin = require("extract-text-webpack-plugin"),
      FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const $ = require('../core/util');

var entry = {},entryPath = path.resolve("src/script/entry");
var files = fs.readdirSync(entryPath);

files.forEach(function(file){
  entry[file.replace(/\.vue$/,"").replace(/\.js$/,"")] = path.join(entryPath,file);
});

//把vue加入common里面
entry["common"] = ['vue','@U/api','@U/ajax','@R/common-R'];


var baseWebpackConfig = {
  entry:entry,
  output:{
    path:path.resolve("dist/widget/script"),
    publicPath:"",
    filename:'[name].js'
  },
  plugins:[
    new webpack.optimize.CommonsChunkPlugin('common'),
    new webpack.DefinePlugin({
      "process.env": {
         NODE_ENV: JSON.stringify("production")
       }
    }),
    new ExtractTextPlugin({filename:"../css/[name].css"}),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@V':path.resolve('src/script/view'),
      '@I':path.resolve('src/script/interactor'),
      '@P':path.resolve('src/script/presenter'),
      '@E':path.resolve('src/script/entity'),
      '@R':path.resolve('src/script/routing'),
      '@U':path.resolve('src/script/utils'),
      '@': path.resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options:{
          loaders: $.cssLoaders({
            sourceMap: $.isDev(),
            extract: false
          })
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve('src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: $.isDev()?'../../src/image/[name].[ext]':'../image/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: $.isDev()?'../../src/fonts/[name].[ext]':'../fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  }
};

baseWebpackConfig = require('./'+$.env()+'.webpack.config.js')(baseWebpackConfig);

module.exports = merge(baseWebpackConfig,{
  module:{
    rules:$.styleLoaders({ sourceMap: $.isDev(),extract:!$.isDev() })
  }
});
