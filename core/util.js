const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  hasParam(name){
    if(name.indexOf("--") == -1){
      name = "--"+name;
    }
    var isExist = false;
    process.argv.forEach(function(item){
      if(name == item) isExist = true;
    });
    return isExist;
  },
  param(name,def){
    var result = "";
    process.argv.forEach(function(item){
      if(new RegExp("^--"+name+"-\\w+").test(item)){
        result = item.replace(new RegExp("^--"+name+"-"),"");
      }
    });
    return result || def || "";
  },
  env(){
    return this.param("env","dev");
  },
  isDev(){
    return this.env() === "dev";
  },
  config(){
    return this.param("config",this.env());
  },
  extends(target,source){
    target = target || {};
    source = source || {};
    var result = {};
    for(var key in target){
      result[key] = target[key];
    }
    for(var key in source){
      result[key] = source[key];
    }
    return result;
  },
  cssLoaders(options){
    options = options || {}

    var cssLoader = {
      loader: 'css-loader',
      options: {
        minimize: process.env.NODE_ENV === 'production',
        sourceMap: options.sourceMap
      }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders (loader, loaderOptions) {
      var loaders = [cssLoader]
      if (loader) {
        loaders.push({
          loader: loader + '-loader',
          options: Object.assign({}, loaderOptions, {
            sourceMap: options.sourceMap
          })
        })
      }

      // Extract CSS when that option is specified
      // (which is the case during production build)
      if (options.extract) {
        return ExtractTextPlugin.extract({
          use: loaders,
          fallback: 'vue-style-loader'
        })
      } else {
        return ['vue-style-loader'].concat(loaders)
      }
    }
    return {
      css: generateLoaders(),
      postcss: generateLoaders(),
      less: generateLoaders('less'),
      sass: generateLoaders('sass', { indentedSyntax: true }),
      scss: generateLoaders('sass'),
      stylus: generateLoaders('stylus'),
      styl: generateLoaders('stylus')
    }
  },
  styleLoaders(options) {
    var output = [];
    var loaders = this.cssLoaders(options)
    for (var extension in loaders) {
      var loader = loaders[extension]
      output.push({
        test: new RegExp('\\.' + extension + '$'),
        use: loader
      })
    }
    return output;
  }
};
