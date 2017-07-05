const path = require("path");

const $ = require('../core/util');

module.exports = {
  //自动同步代码
  testX:600,
  testY:200,
  testKey:"i",
  testModified:["control"],
  version:[
    path.resolve("dist/html/win-layout.html"),
    path.resolve("dist/html/frame-layout.html")
  ],
  getServer:function(){
    var server = {
      test:{
        '*':'http://localhost:8080'
      },
      product:{
        '*':'http://localhost:9090'
      }
    };
    return {
      server:server[$.config()],
      tpl:path.resolve("config/template/server."+$.param("server","web")+".tpl"),
      path:path.resolve("src/script/utils/server.js")
    }
  }
};
