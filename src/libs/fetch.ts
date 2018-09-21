import _axios from './axiosConfig';
import qs from 'qs'

function fetch(url: string, params: any, cb: any) {
  _axios.post(url, qs.stringify(params))
      .then(res => {
          return cb(res.data);
      }).catch(err => {
      if (err.response) {
          // 请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.header);
      } else {
          // 一些错误是在设置请求的时候触发
          console.log('Error', err.message);
      }
      console.log(err.config);
  });
}

export default fetch