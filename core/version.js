const fs = require('fs'),
      path = require('path'),
      crypto = require('crypto');

function getReplace(file,fileString,tag,attr){
  var timestamp = new Date().getTime();
  var replace = {};
  var regex = new RegExp("<"+tag+".*?"+attr+"=(\"|')(.*?\\?_v_=.*?)('|\").*?>","ig");
  var m = null;
  while((m = regex.exec(fileString)) != null){
    var filePath = path.join(path.dirname(file),m[2].split('?')[0]);
    if(fs.existsSync(filePath)){
      var hash = crypto.createHash('md5').update(fs.readFileSync(filePath,"utf-8")).digest('hex');
      replace[m[0]] = m[0].replace(/\?_v_=.*?('|")/i,"?_v_="+hash+m[3]);
    }else{
      replace[m[0]] = m[0].replace(/\?_v_=.*?('|")/i,"?_v_="+timestamp+m[3]);
    }
  }
  for(var key in replace){
    fileString = fileString.replace(key,replace[key]);
  }
  return fileString;
}



module.exports = function(files){
  if(typeof files == "string"){
    files = [files];
  }
  if(!files || files.length == 0) return;

  files.forEach(function(file,index){
    if(!fs.existsSync(file)) return true;
    var fileString  = fs.readFileSync(file,"utf-8");

    fileString = getReplace(file,getReplace(file,fileString,"script","src"),"link","href");
    fs.writeFileSync(file,fileString,"utf-8");
  });


}
