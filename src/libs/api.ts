import fetch from './fetch';



/*
 * @Description: 数据请求方法
 * @Date: 2017-07-05 08:13:38
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2017-09-18 12:50:21
 */
export default {
  // 登录信息
  getMenuData(cb: any, params: any) {
      return fetch('server/main.php', {menu: true}, cb);
  },
  getIndexData(cb: any, params: any) {
      return fetch('server/main.php', { bNo: params }, cb);
  },
};