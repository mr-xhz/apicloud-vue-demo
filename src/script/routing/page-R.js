import $api from '@U/api'

import interceptorGlobal from '@R/interceptor-global'

export default interceptorGlobal.proxy("page",{ 
  index(pageParam){
    $api.openWin({
      name:'index-win',
      pageParam
    },true);
  },
  page1(pageParam){
    $api.openWin({
      name:'page1-win',
      pageParam
    },true);
  }
})
