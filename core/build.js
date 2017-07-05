const $ = require("./util"),
      config = require("../config").getBase(),
      webpackConfig = require("../config").getWebpack(),
      writeConfig = require("./writeConfig"),
      version = require("./version");


const webpack = require('webpack');

//先写配置文件
writeConfig();

//再生成代码
webpack(webpackConfig,function(err,status){
  //如果有错误就直接返回
  if(err || (status && status.compilation && status.compilation.errors.length > 0)){
    return;
  }
  //修订静态资源的版本
  version(config.version);
  if($.hasParam("sync")){
    //假如需要同步，那么就调取同步的代码，模拟鼠标点击和键盘输入
    const robot = require("robotjs");
    robot.moveMouse(config.testX, config.testY);
    robot.mouseClick();
    robot.keyTap(config.testKey,config.testModified);
  }
});
