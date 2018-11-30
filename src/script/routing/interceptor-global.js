import $api from '@U/api'

export default {
  proxy(name,router){
    if(typeof router == 'undefined' && typeof name == 'object'){
      router = name;
      name = null;
    }
    router._routerName = name;
    return this._proxy(router);
    // return router;
  },
  _proxy(router){
    var self = this;
    var proxyRouter = {};
    for(let key in router){
      let field = router[key];
      if(typeof field == 'function'){
        proxyRouter[key] = function(){
          var result = null;
          var r = self.preHandle(proxyRouter,key,router._routerName);
          if(r === true){
            result = field.apply(proxyRouter,arguments);
          }
          self.afterHandle(proxyRouter,key,router._routerName,r);
          return result;
        }
      }
    }
    return proxyRouter;
  },
  /////////////////////////////////////////////////////////////////////
  preHandle(router,method,routerName){
    return true;
  },
  afterHandle(router,method,routerName,preHandleResult){

  }
}