<template>
    <div class="games-contain">
        <div class="content">
            <canvas id="canvas1" width="1200px" height="800px"></canvas>
            <canvas id="canvas2" width="1200px" height="800px"></canvas>
        </div>
        <div class="text-center mt10">
            <el-button long type="warning" size="large" class="btn-orcish" @click="start">重新开始</el-button>
        </div>
        <div class="rule" @mouseenter="showRule" @mouseleave="hideRule">
            <p>1、方向键操作： 方向键控制移动，空格键发射魔法飞弹；</p>
            <p>2、被僵尸碰到生命值会下降，所以你的走位要比僵尸更骚；</p>
            <p>3、Boss倒计时结束会出现强大的Boss；</p>
            <p>4、杀死僵尸将会随机掉落物品(5秒后自动消失)：</p>
            <p> <img src="../assets/img/orcish/ypr.png" width="30px" height="50px">  回复兽人生命值</p>
            <p><img src="../assets/img/orcish/fz.png" width="30px" height="50px">    增加魔弹攻击力</p>
            <p><img src="../assets/img/orcish/sz.png" width="30px" height="50px">    增加魔弹大小和速度</p>
            <p><img src="../assets/img/orcish/xz.png" width="30px" height="50px">    增加兽人移动速度</p>
            <p><img src="../assets/img/orcish/zb.png" width="30px" height="50px">    增加兽人生命值上限</p>
            <p><img src="../assets/img/orcish/ypy.png" width="30px" height="50px">   获得5秒钟伤害免疫</p>
            <p>5、兽人生命值为零或僵尸数量增长到50则游戏结束；</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
    import OrcishGame from '../gameClasses/srjs/main';

    @Component
    export default class Orcish extends Vue {

        private _orcish: OrcishGame|null = null;

        constructor() {
            super();
           
        }
        mounted() {
            this._orcish = new OrcishGame();
            this.start();
            setTimeout(() => {
                $('.rule').addClass('hide-rule');
            }, 3000);
        }

        start() {
            this._orcish = new OrcishGame();
            this._orcish.start();
            $(".btn-orcish").blur();
        }

        end() {
            if (this._orcish) {
                this._orcish.end();
            }
        }

        showRule() {
            $('.rule').removeClass('hide-rule');
        }

        hideRule() {
            $('.rule').addClass('hide-rule');
        }

        destroyed() {
            this.end()
        }
    }
</script>

<style lang="less">
    .games-contain {
        position: relative;
    }
   
</style>