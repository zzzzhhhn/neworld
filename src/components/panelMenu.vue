<template>
  <div>
    <div v-if="isMobile">
      <div class="mobile-title">
        <p>愿我如星君如月</p>
        <p>夜夜流光相皎洁</p>
      </div>
      <span class="mobile-items-container" v-show="showMobileContainer">
        <div class="mobile-item" @click="onShowMobileItem('novel')">小说</div>
        <div class="mobile-item" @click="onShowMobileItem('game')">游戏</div>
      </span>
      <div class="mobile-message" v-show="showMobileMessage">{{mobileMessage}}</div>
      <div class="mobile-novel-panel" :class="{menu: currentNovelPanel === 'menu', catalog: currentNovelPanel === 'catalog', chapter: currentNovelPanel === 'chapter'}">
        <div class="mobile-novel-item">
          <div class="mobile-novel-title">
            <Icon type="ios-undo" size="50" class="cursor-pointer pull-right mr10 poa t0 r0" color="gray" v-if="currentNovelPanel === 'chapter'" @touchend.native="onChangePanel('catalog')"></Icon>
          </div>
          <div class="mobile-novel-chapter-container">
          <div class="mobile-novel-chapter" v-html="chapterData.content"></div>
          </div>
        </div>
        <div class="mobile-novel-item">
          <div class="mobile-novel-title">
            <Icon type="ios-undo" size="50" class="cursor-pointer pull-right mr10 poa t0 r0" color="gray" v-if="currentNovelPanel === 'catalog'" @touchend.native="onChangePanel('menu')"></Icon>
          </div>
          <div class="mobile-novel-chapter-container">
            <div class="mobile-novel-img">
              <img :src="novelInfo.img" />
            </div>
            <div class="novel-info-label">书名: <span class="info-value">{{novelInfo.name}}</span></div>
            <div class="novel-info-label">题材: <span class="info-value">{{novelInfo.theme}}</span></div>
            <div class="novel-info-label">创作状态: <span class="info-value">{{statusList[novelInfo.is_end]}}</span></div>
            <div class="novel-info-label mb20">简介: <span class="info-value">{{novelInfo.description}}</span></div>
            <div class="novel-catalog-item mb10" v-for="(item, index) in novelCatalogs" :key="index" @touchend="onShowMobileChapter(item.id)">{{item.name}}</div>
          </div>
        </div>
        <div class="mobile-novel-item">
          <div class="mobile-novel-title">
            <Icon type="ios-undo" size="50" class="cursor-pointer pull-right mr10 poa t0 r0" color="gray" v-if="currentNovelPanel === 'menu'" @touchend.native="onHideNovelPanel"></Icon>
          </div>
          <div class="mobile-novel-chapter-container">
            <div class="novel-menu-item" v-for="item in this.menuLists['novels']" :key="item.id" @click="onShowMobileNovel(item.id, item.name)">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <!--右菜单-->
      <div class="right-menu" >
        <div class="right-menu-item cursor-pointer" @click="onshowLeftMenu('novels')">小说</div>
        <div class="right-menu-item cursor-pointer" @click="onshowLeftMenu('games')">游戏</div>
        <div class="right-menu-item cursor-pointer" v-if="userData.role_id == 1 || true" @click="onshowLeftMenu('manage')">管理</div>
        <div class="user-name" @click.self="onShowRightMenu()">欢迎您，{{!!userData.nickname ? userData.nickname : '游客250'}}</div>

      </div>
      <div class="right-menu-sign"  @click.self="onShowRightMenu()">
        <div class="right-menu-item cursor-pointer right-menu-sign-item" @click="onshowLeftMenu('sign_in')">登录</div>
        <div class="right-menu-item cursor-pointer right-menu-sign-item" @click="onshowLeftMenu('sign_up')">注册</div>
      </div>
      <!--左菜单-->
      <div class="left-menu" :class="{'show-left-menu': showLeftMenu, 'back-left-menu': backLeftMenu}">
            <span v-for="item in currentMenu" :key="item.id">
                <router-link :to="item.url || '/'">
                    <div class="left-menu-item cursor-pointer" @click="onShowMain(item.id, item.name)">
                        <span>{{item.name}}</span>
                    </div>
                </router-link>
            </span>

        <sign-in v-if="currentType === 'sign_in'" @success="onshowLeftMenu('novels')"></sign-in>
        <sign-up v-if="currentType === 'sign_up'" @success="onshowLeftMenu('sign_in')"></sign-up>

        <Button v-if="currentType === 'manage'" size="large" long type="success" class="f18 o6" @click="onShowMain('manage', 'novel')">管理小说</Button>
        <Button v-if="currentType === 'manage'" size="large" long type="warning" class="f18 o6" @click="onShowMain('manage', 'game')">管理游戏</Button>

      </div>
      <!--上标题-->
      <div class="top-title" :class="{'show-title': showTitle, 'back-title': backTitle}">
        <span v-if="!isReading">{{currentTitle}}</span>
        <div class="novel-msg container-fluid" v-if="isReading">
          <div class="col-xs-12 text-center index-title">{{indexData.iName}}</div>
          <div class="col-xs-6 text-center index-msg">字数： {{indexData.count}}</div>
          <div class="col-xs-6 text-center index-msg">上传时间： {{indexData.createTime}}</div>
        </div>
      </div>
      <!--下主体-->
      <div class="main" :class="{'show-main': showMain, 'back-main': backMain, 'expand': isExpand}">
        <div class="main-title">
          <Icon type="ios-undo" class="cursor-pointer" size="20" color="gray" v-if="(isReading || currentManagePanel !== 'list') && currentManagePanel !== 'recycle'" @click.native="onBackToIndex"></Icon>
          <Icon type="ios-undo" class="cursor-pointer" size="20" color="gray" v-if="currentManagePanel === 'recycle'" @click.native="onBackToNovelMange"></Icon>
          <Icon type="md-contract" class="cursor-pointer" size="20" color="gray" v-if="isExpand" @click.native="onContract"></Icon>
          <Icon type="md-expand" class="cursor-pointer" size="20" color="gray" v-if="!isExpand" @click.native="onExpand"></Icon>
          <Icon type="md-power" size="20" class="cursor-pointer" color="gray" @click.native="onHideMain"></Icon>
        </div>
        <novel-panel v-if="currentType === 'novels' && !isReading" :novelData="novelData" @read="onBeginReading"></novel-panel>
        <game-manage v-show="currentType === 'manage' && manageType === 'game'"></game-manage>
        <novel-manage ref="novel_manage" v-show="currentType === 'manage' && manageType === 'novel'" @panel="getManagePanel"></novel-manage>
        <div class="novel-content" v-if="isReading">
          <div v-html="chapterData.content"></div>
        </div>
        <router-view></router-view>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
    import novelPanel from './novelPanel.vue';
    import signUp from './signUp.vue';
    import signIn from './signIn.vue';
    import { mapGetters } from 'vuex';
    import gameManage from './gameManage.vue';
    import novelManage from './novelManage.vue';
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import { Getter, Action} from 'vuex-class';

    @Component({
        components: {
            novelPanel, signUp, signIn, gameManage, novelManage
        }
    })
    export default class panelMenu extends Vue {
        private showRightMenu: boolean = false;    //菜单面板是否显示
        private showLeftMenu: boolean = false;
        private backLeftMenu: boolean = false;
        private currentType: string = '';     //当前显示菜单类型
        private currentMenu: any[] = [];    //当前渲染列表
        private menuLists: any = {
            novels: [],
            games: [],
            blogs: []
        };
        private showTitle: boolean = false;
        private backTitle: boolean = false;
        private showMain: boolean = false;
        private backMain: boolean = false;
        private novelData = {};
        private isExpand: boolean = false;
        private currentTitle: string = '';
        private isReading: boolean = false;    //是否阅读状态
        private currentManagePanel: string = 'list';   //是否处于管理界面
        private managePanels: string[] = ['list', 'info', 'index', 'content'];
        private chapterData = {};        //章节内容
        private indexData = {};    //章节信息
        private userData = {
            role_id: ''
        };
        private manageType: string = '';
        private right_right_menu_sign: number = 0;      //右下菜单收起长度
        private top_right_menu: string = '';     //右菜单收起长度
        private tempType: string = '';
        private isMobile: boolean = false;
        private mobileMessage: string = '';
        private showMobileMessage: boolean = false;
        private showMobileContainer: boolean = true;
        private currentNovelPanel: string = '';
        private novelInfo:any = {};
        private novelCatalogs: any[] = [];
        private statusList =
            {
                0: '连载中', 1: '已完结'
            };

        @Action('getMenuList')
        doGetMenuList() {};

        created() {
            this.doGetMenuList();
            this.userData = this.getUserData;
        }
        beforeMount() {
            this.isMobile = screen.width / screen.height < 1;
            if (this.isMobile) {
                $('html').addClass('mobile');
            } else {
                $('html').addClass('web');
            }
        }
        mounted() {
            if (!this.isMobile) {
                this.rightMenuResize();
                window.onresize = () => {
                    this.rightMenuResize();
                };
            }
        }
        onShowMobileItem(type: string) {
          if (type === 'novel') {
            this.showMobileContainer = false;
            this.currentNovelPanel = 'menu';
          }  else if (type === 'game') {
              this.onShowMobileMessage('目前只支持网页版');
          }
        }

        onHideNovelPanel() {
            this.showMobileContainer = true;
            this.currentNovelPanel = '';
        }

        onChangePanel(val: string) {
            this.currentNovelPanel = val;
        }

        onShowMobileNovel(id: number, name: string) {
            window.post('novel', {id: id}, (res: any) => {
                if (res.error_code === 0) {
                    this.currentNovelPanel = 'catalog';
                    this.novelInfo = res.data;
                    this.novelInfo.name = name;
                    this.novelCatalogs = this.novelInfo.catalog;
                } else {
                    this.$Message.error(res.message);
                }
            });
        }

        onShowMobileChapter(id: number) {
            this.doGetChapter(id);
            this.currentNovelPanel = 'chapter';
        }

        onShowMobileMessage(msg: string) {
            if (!this.showMobileMessage) {
                this.mobileMessage = msg;
                this.showMobileMessage = true;
                setTimeout(() => {
                    this.showMobileMessage = false;
                }, 1500);
            }
        }

        rightMenuResize() {
            const width_right: number | undefined = $('.right-menu').width() || 0;
            $('.right-menu').height(width_right * 649 / 425);
            const  height_right = $('.right-menu').height() || 0;
            const width_right_sign: number|undefined = $('.right-menu-sign').width() || 0;
            $('.right-menu-sign').height(width_right_sign * 425 / 649);
            const height_right_sign: number|undefined = $('.right-menu-sign').height() || 0;
            this.top_right_menu = height_right * 0.9 * -1 + 'px';
            this.right_right_menu_sign = width_right_sign * 0.9 * -1;
            $('.right-menu').css('top', this.top_right_menu);
            $('.right-menu-sign').css('right', this.right_right_menu_sign);
        }

        /**
         * 显示面板
         */
        onShowRightMenu() {
            if(!this.showRightMenu) {
                this.showRightMenu = true;
                $('.right-menu').css('top', 0);
                setTimeout(() => {
                    $('.right-menu').css('top', -10 + 'px');
                    $('.right-menu-sign').css('right', 0);
                }, 500);
                setTimeout(() => {
                    $('.right-menu-sign').css('right', -10 + 'px');
                }, 1000);
            } else {
                $('.right-menu-sign').css('right', this.right_right_menu_sign);
                setTimeout(() => {
                    $('.right-menu').css('top', this.top_right_menu);
                    this.showRightMenu = false;
                }, 500);
            }
        }
        /**
         * 显示左侧菜单
         * @param type
         */
        onshowLeftMenu(type: string) {
//            if (['sign_in', 'sign_up'].indexOf(type) !== -1) {
//                return this.$Message.info('暂未开放');
//            }
            if(type !== this.tempType && this.showLeftMenu) {
                this.showLeftMenu = false;
                this.backLeftMenu = false;
                setTimeout(() => {
                    this.currentType = type;
                    setTimeout(() => {
                        this.currentMenu = this.menuLists[type];
                        this.$nextTick(() => {
                            this.showLeftMenu = true;
                            setTimeout(() => {
                                this.backLeftMenu = true;
                            }, 500);
                        });
                        this.tempType = type;
                    },300);

                },500);
            }else if(!this.showLeftMenu) {
                this.currentType = type;
                this.tempType = type;
                this.currentMenu = this.menuLists[type];
                this.$nextTick(() => {
                    this.showLeftMenu = true;
                    setTimeout(() => {
                        this.backLeftMenu = true;
                    }, 500);
                });
            }else {
                this.showLeftMenu = false;
                this.backLeftMenu = false;
            }



        }
        /**
         * 显示标题和主体
         * @param id
         */
        onShowMain(id: string, name: string) {
            this.currentTitle = name;
            if(this.currentType === 'novels') {
                window.post('novel', {id: id}, (res: any) => {
                if (res.error_code === 0) {
                    this.novelData = res.data;
                } else {
                    this.$Message.error(res.message);
                }
            });

            }else if(id === 'manage') {
                this.manageType = name;
                if(name === 'novel') {
                    this.currentTitle = '管理小说';
                }else {
                    this.currentTitle = '管理游戏';
                }
            }
            this.showLeftMenu = false;
            this.backLeftMenu = false;
            this.showRightMenu = false;
            $('.right-menu-sign').css('right', this.right_right_menu_sign);
            $('.right-menu').css('top', this.top_right_menu);

            setTimeout(() => {
                this.showMain = true;
                this.showTitle = true;
                setTimeout(() => {
                    this.backMain = true;
                    this.backTitle = true;
                }, 500);
            },500);
        }
        onHideMain() {
            this.showMain = false;
            this.showTitle = false;
            this.backMain = false;
            this.backTitle = false;
            this.isExpand = false;
            this.isReading = false;
            setTimeout(() => {
                this.showLeftMenu = true;
                this.onShowRightMenu();
                setTimeout(() => {
                    this.backLeftMenu = true;
                }, 500);
            },500);
        }
        /**
         * 全屏
         */
        onExpand() {
            this.isExpand = true;
        }
        /**
         * 收缩
         */
        onContract() {
            this.isExpand = false;
        }
        /**
         * 开始阅读
         * @param obj
         */
        onBeginReading(obj: any) {
            this.isReading = true;
            this.indexData = obj;
            this.doGetChapter(obj.id);
        }

        doGetChapter(id: number) {
            window.post('chapter', {id: id}, (res: any) => {
                if (res.error_code === 0) {
                    this.chapterData = res.data;
                } else {
                    this.$Message.error(res.message);
                }
            });
        }

        /**
         * 回到目录页
         */
        onBackToIndex() {
            if(this.currentType === 'novels') {
                this.isReading = false;
            }else {
                if(this.currentManagePanel !== 'list') {
                    this.currentManagePanel = this.managePanels[this.managePanels.indexOf(this.currentManagePanel) - 1];
                    (this.$refs.novel_manage as any).changePanel(this.currentManagePanel);
                }

            }
        }
        onBackToNovelMange() {
            (this.$refs.novel_manage as any).changePanel('list');
        }
        /**
         * 切换管理界面
         */
        getManagePanel(val: string) {
            this.currentManagePanel = val;
        }

        @Getter('listenUserData') getUserData: any;
        @Getter('listenNovelList') getNovelData: any;
        @Getter('listenBlogList') getBlogData: any;
        @Getter('listenGameList') getGameData: any;

        @Watch('getUserData', {deep: true})
        watchGetUserData (val: any) {
            this.userData = val;
        }

        @Watch('getNovelData', {deep: true})
        watchGetNovelData (val: any) {
            this.menuLists.novels = val;
        }

        @Watch('getGameData', {deep: true})
        watchGetGameData (val: any) {
            this.menuLists.games = val;
        }

        @Watch('getBlogData', {deep: true})
        watchGetBlogData (val: any) {
            this.menuLists.blogs = val;
        }

    }

</script>

<style lang="less">
    @panel_color: black;
    @panel_opacity: .6;
    @panel_right_color: #333;
    @font-face {
      font-family: panel_font;
      src: url("../assets/font/2.ttf");
    }
    @keyframes bgcolor
    {
      from { background-color: transparent }
      to { background-color: black}
    }

    @keyframes color {
      from { color: gray }
      to { color: black}
    }

    @keyframes mobile_item {
      from { margin-top: 10vh; margin-left: 5vw; }
      to { margin-top: 15vh; margin-left: 15vw; }
    }

    @keyframes novel_item {
      from { margin-top: 1vh; margin-left: 8vw; }
      to { margin-top: 1.5vh; margin-left: 12vw; }
    }

    html {
      &.web .zora-world {
        background-image: radial-gradient(circle at 80% 80%, transparent 0, black 50%);
      }
      &.mobile .zora-world {
        background-image: radial-gradient(circle at 70% 70%, transparent 0, black 70%);

        .mobile-title {
          position: absolute;
          bottom: 0;
          font-family: panel_font;
          text-align: center;
          width: 100%;
          font-size: 1.2rem;
          animation: color 5s infinite alternate;
        }

        .mobile-example {
          width: 80vw;
          margin: 10vh auto;
          border-radius: 0.3rem;
          text-align: center;
          font-size: 1.5rem;
        }

        .mobile-item {
          .mobile-example();
          height: 10vh;
          line-height: 10vh;
          background: rgba(200,200,200,.1);
          animation: mobile_item 5s infinite alternate;
        }

        .mobile-message {
          .mobile-example();
          padding: 0.5vh 0.5vw;
          color: lightgrey;
          font-weight: 400;
          font-size: 1rem;
        }

        .mobile-novel-panel {
          width: 300vw;
          height: 100vh;
          background: rgba(200,200,200,.8);
          position: absolute;
          left: -300vw;
          display: flex;
          flex-direction: row;

          &.menu {
            left: -200vw;
          }

          &.catalog {
            left: -100vw;
          }

          &.chapter {
            left: 0;
          }

          .mobile-novel-item {
            width: 100vw;
            font-size: 1.2rem;
            overflow: hidden;
            position: relative;
          }

          .mobile-novel-title {
            height: 10vh;
          }

          .novel-menu-item {
            width: 80vw;
            height: 5vh;
            line-height: 5vh;
            padding-left:1rem;
            font-size: 1.2rem;
            background-image: linear-gradient(to right,gray 0, transparent 100%);
            border-radius: 0.3rem;
            animation: novel_item 5s infinite alternate;
          }

          .mobile-novel-img {
            text-align: center;
            border-radius: .3rem;
          }

          .novel-info-label {
            color: grey;
            padding-left:10vw;

            .info-value {
              color: lightgrey;
            }
          }

          .novel-catalog-item {
            padding-left:10vw;
          }

          .mobile-novel-chapter-container {
            overflow: auto;
            height: 90vh;
          }

          .mobile-novel-chapter {
            width: 100vw;
            padding: 1rem;
          }


        }
      }
    }

    .zora-world {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      animation: bgcolor 5s infinite alternate;
      font-family: "Microsoft YaHei";

      .right-menu {
        width: 20%;
        position: absolute;
        right: 20px;
        transition: top .5s ease-out;
        background: rgba(200,200,200,.4);
        border-radius: 0 0 4px 4px;

        color: white;

        .user-name {
          width: 100%;
          height: 10%;
          position: absolute;
          bottom: 0;
          text-align: center;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: color 5s infinite alternate;
        }
      }

      .right-menu-sign {
        width: 21%;
        position: absolute;
        bottom: 10%;
        transition: right .5s ease-out;

        background: rgba(200,200,200,.4);
        border-radius: 4px 0 0 4px;

        .right-menu-item.right-menu-sign-item {
          width: 40%;
          height: 100%;
          float: left;
          writing-mode: vertical-rl;

          &:first-child {
            margin-left: 10%;
          }
        }
      }

      .right-menu-item {
        width: 100%;
        height: 20%;
        font-size: 30px;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: gray;
        }
      }

      .left-menu {
        width: 75%;
        height: 80%;
        padding: 20px;
        position: absolute;
        left: -80%;
        top: 10%;
        transition: left .5s ease-out;
        overflow-x: auto;
        overflow-y: hidden;
        display: flex;
        flex-direction: row;
        border-radius: 0 4px 4px 0;
        background: rgba(200,200,200,.4);

        &.show-left-menu {
          left: 0;
        }

        &.back-left-menu {
          transition: top .1s ease-out;
          left: -10px;
        }

        .btn-manage {
          width: 50%;
          margin: 75px 25% 0;

          button {
            width: 100%;
          }
        }

        .left-menu-item {
          width: 100px;
          min-width: 100px;
          height: 100%;
          writing-mode: vertical-rl;
          opacity: .7;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: gray;
          font-size: 20px;
          border-radius: 4px;
          color: #333;

          &:hover {
            opacity: .8;
            color: lightgray;
          }

        }
      }

      .top-title {
        width: 50%;
        height: 10%;
        position: absolute;
        left: 25%;
        top: -10%;
        transition: top .5s ease-out;
        background: rgba(200,200,200,.4);
        border-radius: 0 0 4px 4px;
        padding: 1%;
        font-size: 40px;
        font-weight: bold;
        line-height: 150%;
        text-align: center;
        color: #222;
        text-shadow: 2px 2px 10px gray;

        .novel-msg {

          .index-title {
            height: 10%;
            font-size: 25px;
            line-height: 200%;
          }

          .index-msg {
            height: 3%;
            font-size: 15px;
            line-height: 34%;
            color: #ffffe0;
          }
        }

        &.show-title {
          top: 0;
        }

        &.back-title {
          transition: top .1s ease-out;
          top: -10px;
        }
      }

      .main {
        width: 90%;
        height: 89%;
        position: absolute;
        left: 5%;
        bottom: -89%;
        transition: all .5s ease-out;
        overflow-y: auto;

        background: rgba(200,200,200,.4);
        color: white;
        opacity: .9;
        border-radius: 10px;

        &.show-main {
          bottom: 0;
        }

        &.back-main {
          transition: all .1s ease-out;
          bottom: -10px;
        }

        &.expand {
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          opacity: 1;
        }

        .main-title {
          width: 100%;
          height: auto;
          text-align: right;
          padding: 10px 20px;
        }

        .novel-content {
          padding: 20px;
          font-size: 16px;
          font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
          color: olivedrab;
        }
      }
    }
</style>
