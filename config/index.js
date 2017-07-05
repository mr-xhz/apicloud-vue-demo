var $ = require("../core/util");
module.exports = {
  getBase(){
    var config = require("./"+$.env()+".base.js");
    return $.extends({
      NODE_ENV:'"production"',
      config:$.config(),
      env:$.env()
    },config);
  },
  getWebpack(){
    return require("./"+"webpack.config.js");
  }
}
