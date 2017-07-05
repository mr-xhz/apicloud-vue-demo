const config = require('../config').getBase();

const fs = require('fs');

module.exports = function(){
  var data = config.getServer();
  if(!data.tpl || !data.path)
  if(!fs.existsSync(data.tpl)) return;
  data.server = data.server || {};
  var json = JSON.stringify(data.server).replace(/^\{/,"").replace(/\}$/,"");
  fs.writeFileSync(data.path,fs.readFileSync(data.tpl,"utf-8").replace("{data}",json),{
    encoding:"utf-8",
    flag:"w"
  });

}
