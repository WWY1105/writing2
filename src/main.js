// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//  import lrz from 'lrz' 
// import 'es6-promise/auto'
// import Vuex from 'vuex'
import store from './store'
import wx from  'weixin-js-sdk'
import '@/assets/css/main.css'
import '@/assets/css/iconfont.css'

import '@/assets/js/ydui.flexible'

import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
// Vue.use(lrz)
// 引入公共的JS
import {http,checkTel} from '@/assets/js/http.js'
// Vue.prototype.common=common
Vue.prototype.$http = http;
Vue.prototype.checkTel=checkTel

// Vue.use(YDUI)
Vue.config.productionTip = false

/* eslint-disable no-new */





import { Datetime, Group ,PopupPicker,TransferDom,Range  } from 'vux'
Vue.component(Datetime.name, Datetime, Range, Group.name, Group);

Vue.component('popup-picker', PopupPicker)




Vue.directive('transfer-dom', TransferDom)







new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
