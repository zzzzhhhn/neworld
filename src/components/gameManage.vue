<template>
    <div class="container">
        <Row class="mb20 pl20" v-for="(item, index) in gameList" :key="index">
            <Col span="8">
                <Input v-model="item.name" prefix="ios-book" size="large" placeholder="请输入游戏名称" />
            </Col>
            <Col span="8" class="pl20">
                <Input v-model="item.url" prefix="ios-book" size="large" placeholder="请输入游戏url" />
            </Col>
            <Col span="8" class="pl20">
            <ButtonGroup size="large">
                <Button type="success" class="ml20" @click="updateGameData(item)">保存</Button>
                <Button type="warning" class="ml20" @click="deleteGameData(item.id)">删除</Button>
            </ButtonGroup>
            </Col>
        </Row>

        <Button type="primary" size="large" class="ml20 f18" style="width: 415px" @click="addGameData">新增</Button>
        <Button type="warning" size="large" class="ml20 f18" style="width: 415px" @click="showDeletedNovels">回收站</Button>
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
                    this.$Message.success('保存成功');
                    this.doGetMenuList();
                } else {
                    this.$Message.error('保存失败');
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
         * 删除
         */
        deleteGameData(id: number) {
            this.$Modal.confirm({
                title: '删除', content: '确定要删除吗？', onOk: () => {
                    this.doDelete(id)
                }
            });
        }
        doDelete(id: number) {
            window.post('menu_delete', {id: id}, (res: any) => {
                if (res.error_code === 0) {
                    this.$Message.success('删除成功');
                    this.doGetMenuList();
                } else {
                    this.$Message.error('删除失败');
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