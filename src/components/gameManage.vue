<template>
    <div class="container">
        <el-row class="mb20 pl20" v-for="(item, index) in gameList" :key="index">
            <el-col span="8">
                <el-input v-model="item.name" prefix="ios-book" size="large" placeholder="请输入游戏名称" />
            </el-col>
            <el-col span="8" class="pl20">
                <el-input v-model="item.url" prefix="ios-book" size="large" placeholder="请输入游戏url" />
            </el-col>
            <el-col span="8" class="pl20">
            <el-button-group size="large">
                <el-button type="success" class="ml20" @click="updateGameData(item)">保存</el-button>
                <el-button type="warning" class="ml20" @click="deleteGameData(item.id)">删除</el-button>
            </el-button-group>
            </el-col>
        </el-row>

        <el-button type="primary" size="large" class="ml20 f18" style="width: 415px" @click="addGameData">新增</el-button>
        <!--<el-button type="warning" size="large" class="ml20 f18" style="width: 415px" @click="showDeletedNovels">回收站</el-button>-->
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import fetch from '../libs/fetch';
    import { Getter, Action} from 'vuex-class';

    interface listType {
        id: number;
        name: string;
        type: number;
        url: string;
    }

    @Component
    export default class gameManage extends Vue {
        private gameList: listType[] = [];

       @Action('getMenuList')
        doGetMenuList() {}

        created() {

        }

        /**
         *  更改数据
         * @param {listType} data
         */
        updateGameData(data: listType) {
            let post_url = '';
            if (!data.id) {
                post_url = 'menu_create';

            } else {
                post_url = 'menu_update';
            }
            window.post(post_url, data, (res: any) => {
                if (res.error_code === 0) {
                    this.$message.success('保存成功');
                    this.doGetMenuList();
                } else {
                    this.$message.error('保存失败');
                }
            });
        }

        /**
         * 新增游戏
         */
        addGameData() {
            this.gameList.push({
                id: 0,
                name: '',
                type: 2,
                url: ''
            });
        }
        /**
     * 回收站
     */
    // showDeletedNovels() {
    //     window.post('menu_recycle_list', {type: 1}, (res: any) => {
    //         if (res.error_code === 0) {
    //             this.recycleList = res.data;
    //         } else {
    //             this.$message.error('获取数据失败');
    //         }
    //     });
    // }

        /**
         * 删除
         */
        deleteGameData(id: number) {
            this.$confirm('确定要删除吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.doDelete(id)
            });
        }
        doDelete(id: number) {
            window.post('menu_delete', {id: id}, (res: any) => {
                if (res.error_code === 0) {
                    this.$message.success('删除成功');
                    this.doGetMenuList();
                } else {
                    this.$message.error('删除失败');
                }
            });
        }
        /**
         * 计算属性获取vuex中的游戏列表
         * @returns {getters.listenGameList}
         */
        @Getter('listenGameList') getGameList: any;

        /**
         * watch 计算属性 赋值到data
         * @param {listType[]} val
         */
        @Watch('getGameList')
        watchGameList(val: listType[]) {
            this.gameList = val;
        }

    }
</script>


<style lang="less">

</style>