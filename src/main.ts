import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './assets/less/layouts.less';
import $ from 'jquery';
import post from './libs/fetch';
import './plugins/element';


declare global {
    interface Window {
        $: any;
    }

    interface Window {
        post: any
    }
}
window.post = post;
window.$ = $;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
