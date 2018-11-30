import Vue from 'vue'
import $api from '@U/api'
import commonR from '@R/common-R'
import tap from '@U/tap'

export default{
    init(){
        //注册路由
        commonR.register();
        //实现tap时间的触发
        tap.init();

        Vue.prototype.$api = $api;
        Vue.prototype.$route = commonR;
    }
}