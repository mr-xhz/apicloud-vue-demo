import $api from '@U/api'
//加载所有的路由
import pageR from '@R/page-R'

export default{
  routes:{},
  _formatParam(param){
    if(typeof param == "string"){
       var params = param.split("&");
       param = {};
       params.forEach(item=>{
         var keyvalue = item.split("=");
         param[keyvalue[0]] = keyvalue[1];
       });
     }
     return param || {};
  },
  register(){
    this.routes = {
      pageR
    };
    //全局监听a链接
    var click = "ontouchend" in document ? "click" : "click";
    $api.addEvt(document.body,click,event => {
      if(!event.target || !/^a$/i.test(event.target.tagName)) return;
      if(!/^#route=/i.test(event.target.hash)) return;
      event.preventDefault();
      this.action(event.target.hash);
    });
    $api.ready(() => {
      if(!window.api) return;
      if(api.winName === "root" && !api.frameName){
        this._rootRegister();
      }
    });
  },
  //root 注册
  _rootRegister(){
    console.log("common-R.js root register");
    $api.ready(() => {
      window.api &&  api.addEventListener({
          name:'appintent'
      },(ret,err)=>{
          var appParam = ret.appParam;
          appParam.route = appParam.route || "";
          this.action(appParam.router.split("."),appParam);
      });

      window.api && api.addEventListener({
        name:"routeAction"
      },(ret,err)=>{
        if(!ret.value.routeAndMethod) return;
        var routerAndMethod = ret.value.routerAndMethod.split(".");
        var params = this._formatParam(ret.value.pageParam);
        this.action(routerAndMethod,params);
      });
    });
  },
  action(routeAndMethod,param){
    if(typeof routeAndMethod == "string"){
      if(!/^#route=/i.test(routeAndMethod)) return false;
      var param = this._formatParam(routeAndMethod.replace(/^#/,""));
      var route = param.route || "";
      delete param["route"];
      return this.action(route.split("."),param);
    }
    if(this.routes[routeAndMethod[0]] && this.routes[routeAndMethod[0]][routeAndMethod[1]]){
      this.routes[routeAndMethod[0]][routeAndMethod[1]](param);
      return true;
    }
    console.log("common-R.js 没有找到路由 "+JSON.stringify(routeAndMethod));
    return false;

  }
}
