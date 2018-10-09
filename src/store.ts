import Vue from 'vue'
import Vuex from 'vuex'
import api from './libs/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData: {},
    gameList: [],
    novelList: [],
    blogList: [],
  },
  mutations: {
    USER_DATA(state, data) {
      state.userData = data;
    },
    GAME_LIST(state, data) {
      state.gameList = data;
    },
    NOVEL_LIST(state, data) {
      state.novelList = data;
    },
    BLOG_LIST(state, data) {
      state.blogList = data;
    },

  },
  actions: {
    getUserData({ commit }, data) {
      commit(USER_DATA, data);
    },
    getMenuList({ commit }, params) {
      const novels: any[] = [];
      const games: any[] = [];
      const blogs: any[] = [];
      api.getMenuData((data: any) => {
        data.forEach((item: any) => {
          if (item.type == 1) {
            novels.push(item);
          } else if (item.type == 2) {
            games.push(item);
          } else if (item.type == 3) {
            blogs.push(item);
          }
        });
        commit(GAME_LIST, games);
        commit(NOVEL_LIST, novels);
        commit(BLOG_LIST, blogs);
      }, params);

    },

  },
  getters: {
    listenUserData: state => state.userData,
    listenGameList: state => state.gameList,
    listenNovelList: state => state.novelList,
    listenBlogList: state => state.blogList,
  }
})


const USER_DATA = 'USER_DATA';
const GAME_LIST = 'GAME_LIST';
const NOVEL_LIST = 'NOVEL_LIST';
const BLOG_LIST = 'BLOG_LIST';