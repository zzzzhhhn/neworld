<template>
    <div class="zora-world">

        <router-view></router-view>
    </div>
</template>
<script lang="ts">
    import Vue, { VueConstructor } from 'vue'
    import Component from 'vue-class-component'
    import {ModalInstance, Message} from 'iview'
    import { Getter, Action } from 'vuex-class';

    declare module 'vue/types/vue' {
        interface Vue {
            $Modal: ModalInstance,
            $Message: Message,
            validate: Function,
            resetFields: Function
        }

        interface VueConstructor {
            $Modal: ModalInstance,
            $Message: Message,
            validate: Function,
            resetFields: Function
        }
    }

    @Component
    export default class App extends Vue {

        @Action('getUserData')
        getUserData(data: any) {}

      created() {
          const token = sessionStorage.getItem('zw_token');
          if (token) {
              window.post('user_token', {token: token}, (res: any) => {
                  if (res.error_code === 0) {
                      this.getUserData(res.data);
                  } else {
                      this.$Message.error(res.message);
                  }
              });
          }
      }
    }
</script>

<style lang="less">

.content {
       width: 1200px;
       height: 800px;
       position: relative;
       margin: 0 auto;
       }
       #canvas1,#canvas2 {
           position: absolute;
           left: 0px;
           bottom: 0px;
           z-index: 0;
       }
       #canvas2 {
           z-index: 1;
       }
       .rule {
           position: absolute;
           left: 0;
           top: 0;
           width: 250px;
           height: auto;
           min-height: 800px;
           background-color: yellow;
           padding: 10px 10px;
           font-size: 16px;
           font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
           color: #67b168;
           transition: left 0.3s ease;

           &.hide-rule {
               left: -240px;
           }
       }
</style>