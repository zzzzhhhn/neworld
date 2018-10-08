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


</style>