<style scoped>

</style>
<template>
    <panel-menu></panel-menu>

</template>
<script lang="ts">
    import panelMenu from '../components/panelMenu.vue';
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';



    @Component({
        components: {
            panelMenu
        }
    })
    export default class Index extends Vue{
        handleStart() {
            this.$Modal.info({
                title: 'Bravo',
                content: 'Now, enjoy the convenience of iView.'
            });
        }
    }
    // export default {
    //     components: {
    //         panelMenu
    //     },
    //     mounted() {
    //
    //     },
    //     methods: {
    //         handleStart() {
    //             this.$Modal.info({
    //                 title: 'Bravo',
    //                 content: 'Now, enjoy the convenience of iView.'
    //             });
    //         }
    //     }
    // };
</script>