import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//全局样式
import './assets/css/global.css'
//引入iconfont
import './assets/font/iconfont.css'

//导入axious
import axios from 'axios'
axios.defaults.baseURL="http://175.27.240.185:8080"
// axios.defaults.baseURL="localhost:8000"
axios.defaults.withCredentials = true;
Vue.prototype.$http=axios



//挂载
Vue.config.productionTip = false
//设置访问根路径

//axios.defaults.crossDomain = true;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.formatDate = function (value) {
  let date = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = date.getSeconds();
  s = s < 10 ? "0" + s : s;
  return y + "-" + MM + "-" + d + " " + h + ":" + m;
}

