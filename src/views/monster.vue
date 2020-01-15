<template>
    <div>
        <div class="content">
            <canvas id="canvas1" width="1200px" height="800px"></canvas>
            <canvas id="canvas2" width="1200px" height="800px"></canvas>
        </div>
        <div class="text-center mt10">
            <el-button long type="warning" size="large" class="btn-orcish" @click="start">重新开始</el-button>
        </div>
        <audio AUTOPLAY LOOP>
            <source src="../../static/mp3/monster.mp3" type="audio/mpeg">
            当前浏览器不支持背景音乐。
        </audio>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import MonsterGame from '../gameClasses/monster/main';
    @Component
    export default class Monster extends Vue {
        private _game: MonsterGame|null = null;

        constructor() {
            super();
        }

        mounted() {
            this.start();
        }

        start() {
            this._game = new MonsterGame();
            this._game.start();
        }

        end() {
            if (this._game) {
                this._game.end();
            }
        }

        destroyed() {
            this.end();
        }
    }
</script>


<style lang="less">

</style>