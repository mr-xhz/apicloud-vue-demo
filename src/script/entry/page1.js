import Vue from 'vue'

import Header from '@P/header-P.vue'
import Footer from '@P/footer-P.vue'
import App from '@P/page1-P.vue'
import $api from '@U/api'
import commonR from '@R/common-R'

//注册路由
commonR.register();

var index = {
  createHeader(){
    var header = new Vue({
      el:"#header",
      template:'<Header title="页面1" />',
      components:{
        Header
      }
    });
  },
  createFooter(){
    var footer = new Vue({
      el:"#footer",
      template:'<Footer />',
      components:{
        Footer
      }
    });
  },
  winMain(){
    document.title = "首页";
    this.createHeader();
    this.createFooter();
  },
  winApicloud(){
    $api.ready(()=>{
      $api.openFrame({
        name:"page1-frame",
        header:$api.headerHeight()
      });
    });
  },
  winWeb(){
    main();
  },
  frameMain:main
};

function main(){
  var indexP = new Vue({
    el:"#app",
    template:'<App >',
    components:{
      App
    }
  });

}

$api.init(index);
