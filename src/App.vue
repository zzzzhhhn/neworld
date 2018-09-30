<template>
    <div class="zora-world">

        <router-view></router-view>
    </div>
</template>
<script lang="ts">
    import Vue, { VueConstructor } from 'vue'
    import Component from 'vue-class-component'
    import {ModalInstance, Message} from 'iview'

    declare module 'vue/types/vue' {
        interface Vue {
            $Modal: ModalInstance,
            $Message: Message,
        }

        interface VueConstructor {
            $Modal: ModalInstance,
            $Message: Message,
        }
    }

    @Component
    export default class App extends Vue {
      
    }
</script>

<style lang="less">


</style>