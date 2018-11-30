const fs = require("fs");
const path = require('path');

var os = require('os');

const child_process = require('child_process');

var distPath = path.join(__dirname,'..','dist');

if(!fs.existsSync(distPath)){
    fs.mkdirSync(distPath);
}

function copyIt(from, to) {
    if(os.type() == "Windows_NT"){
        distPath = path.join(to,"widget");
        if(!fs.existsSync(distPath)){
            fs.mkdirSync(distPath);
        }
        child_process.spawnSync('xcopy', [from,distPath ,'/f','/y','/s','/e']);
    }else{
        child_process.spawnSync('cp', ['-r', from, to]);
    }
}

console.log("正在初始化widget目录");

copyIt(path.join(__dirname,'..','src/widget'),distPath);

console.log("初始化widget目录成功");