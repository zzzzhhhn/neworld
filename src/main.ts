import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './plugins/iview.js';
import './assets/less/layouts.less';
import $ from 'jquery';


declare global {
  interface Window { $: any; }
}

window.$ = $;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
