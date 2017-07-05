
import server from '@U/server'
import $api from '@U/api'

export default {
  fetch(url){
    //如果是apicloud那么将url加上前缀
    if($api.isApiCloud && !/^https?:\/\//i.test(url)){
      var s = "";
      for(var key in server){
        if(key === '*'){
          s = server[key];
          break;
        }else if(new RegExp(key).test(url)){
          s = server[key];
          break;
        }
      }
      url = s + url;
    }
    var args = Array.prototype.slice.call(arguments,1);
    args.unshift(url);
    return fetch.apply(window,args);
  },
  _formatParam(param){
    var result = [];
    for(var key in param){
      result.push(key+"="+encodeURIComponent(param[key]));
    }
    return result.join("&");
  },
  _formatGetArgs(){
    var args = Array.prototype.slice.call(arguments);
    var url = args[0],param = args[1];
    if(typeof param == "object"){
      param = this._formatParam(param);
    }
    if(param){
      url.indexOf("?")>=0?(url=url+"&"+param):(url=url+"?"+param);
      args.splice(1,1);
      args[0] = url;
    }
    return args;
  },

  _formatPostArgs(){
    var args = Array.prototype.slice.call(arguments);
    var param = args[1] || {};
    args[1] = {
      method:'POST',
      body:param
    };
    return args;
  },
  _checkStatus(response){
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  },
  get(){
    var args = this._formatGetArgs.apply(this,arguments);
    return this.fetch.apply(this,args).then(this._checkStatus).then(res => {return res.json()});
  },
  getText(){
    var args = this._formatGetArgs.apply(this,arguments);
    return this.fetch.apply(this,args).then(this._checkStatus).then(res => {return res.text()});
  },
  post(){
    var args = this._formatPostArgs.apply(this,arguments);
    args[1].body = this._formatParam(args[1].body);
    args[1].headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    };
    return this.fetch.apply(this,args).then(this._checkStatus).then(res => {return res.json()});
  },
  postJson(){
    var args = this._formatPostArgs.apply(this,arguments);
    args[1].body = JSON.stringify(args[1].body);
    args[1].headers = {
      "Content-Type": "application/json; charset=UTF-8"
    };
    return this.fetch.apply(this,args).then(this._checkStatus).then(res => {return res.json()});
  }
}
