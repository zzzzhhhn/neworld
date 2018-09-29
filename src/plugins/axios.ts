import Vue, { PluginObject } from 'vue';
import _axios from '../libs/axiosConfig';
import './index.d.ts'
const Plugin: PluginObject<any> = {
  install: (Vue) => {
    Vue.$axios = _axios;
  },
};


export default Plugin;
