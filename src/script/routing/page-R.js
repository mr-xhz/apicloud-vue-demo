import $api from '@U/api'

export default{
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
}
