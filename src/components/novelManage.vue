<template>
    <div v-if="currentPanel === 'list'">
        <Row class="mb20 pl20" v-for="(item, index) in novelList" :key="index">
            <Col span="16">
                <Input v-model="item.name" prefix="ios-book" size="large" placeholder="请输入小说名称" />
            </Col>
            <Col span="8" class="pl20">
                <ButtonGroup size="large">
                    <Button type="success" class="ml20" @click="updateNovelData(item)">保存</Button>
                    <Button type="warning" class="ml20" @click="deleteNovelData(item.id)">删除</Button>
                    <Button type="info" class="ml20" @click="novelInfoManage(item.id)">信息管理</Button>
                </ButtonGroup>
            </Col>
        </Row>

        <Button type="primary" size="large" class="ml20 f18" style="width: 415px" @click="addNovelData">新增</Button>
        <Button type="warning" size="large" class="ml20 f18" style="width: 415px" @click="showDeletedNovels">回收站</Button>
    </div>
    <div v-else-if="currentPanel === 'info'" class="text-center">
        <div class="novel-upload">
            <Upload
                    accept="image/*"
                    type="drag"
                    :max-size="2048"
                    :format="['jpg','jpeg','png']"
                    :action="url + 'novel_img'"
                    :on-success="onUploadSuccess"
                    :on-error="onUploadFailed"
                    :show-upload-list="false"
            >
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>Click or drag files here to upload</p>
                </div>
            </Upload>
        </div>
        <Select
                v-model="postInfo.theme"
                style="width:200px"
                :multiple="true"
                size="large"
                class="mt20 mb20"
                placeholder="题材类型"
        >
            <Option v-for="item in themeList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        <br/>
        <Select
                v-model="postInfo.is_end"
                style="width:200px"
                size="large"
                class="mb20"
                placeholder="完成状态"
        >
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <br/>
        <textarea v-model="postInfo.description" type="textarea" class="form-control" placeholder="简介" style="width: 400px; margin: auto"></textarea>
        <br/>
        <Button type="primary" class="mt20" style="width: 200px" @click="updateNovelInfo">保存</Button>
        <br/>
        <Button type="primary" class="mt20" style="width: 200px" @click="novelIndexManage(postInfo.id)">章节管理</Button>
    </div>
    <div v-else-if="currentPanel === 'index'" class="container" style="width:90%;margin:auto">
        <div class="row btn-group btn-group-lg">
            <Button type="primary" @click="addIndexData">新增</Button>
        </div>

        <Row class="mt20" v-for="(item, index) in novelCatalogs" :key="index">
            <Col span="12">
                <Input v-model="item.name" size="large" />
            </Col>
            <Col span="12">
                <ButtonGroup size="large">
                    <Button type="warning" @click="updateIndexData(item)">保存</Button>
                    <Button type="danger" @click="deleteIndexData(item.id)">删除</Button>
                    <Button type="info" @click="novelContentManage(item.id)">内容管理</Button>
                </ButtonGroup>
            </Col>
        </Row>


    </div>
    <div v-else-if="currentPanel === 'content'" class="text-center">
        <div id="toolbar"></div>
        <div id="editor" style="height:600px;"></div>
        <div class="mt20">
            <Button type="primary" style="width:200px" @click="addContentData">保存</Button>
        </div>
    </div>
    <div v-else-if="currentPanel === 'recycle'">
        <Row class="mb20 pl20" v-for="item in recycleList" :key="item.id">
            <Col span="16" class="f16" style="color: #333">
                {{item.name}}
            </Col>
            <Col span="8">
                <Button type="success" class="ml20" @click="recycleNovel(item.id)">回收</Button>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import url from '../libs/urlConfig';

const E = require('wangeditor');

interface listType {
  id: number;
  name: string;
  type: number;
  url: string;
}

interface catalogType {
  id: number | null;
  name: string;
  novel_id: number | null;
}

interface chapterType {
  id: number | null;
  content: string;
  catalog_id: number | null;
}

@Component
export default class novelManage extends Vue {
    private novelList: listType[] = [];
    private currentPanel = 'list';
    private url: string = url;
    private postInfo: any = {};
    private themeList: string[] = [
        '科幻',
        '灵异',
        '魔幻',
        '网游',
        '悬疑',
        '校园',
        '言情',
        '都市',
        '推理',
        '犯罪'
    ];
    private statusList: any[] = [
        {
        label: '连载中', value: 0,
    },{
        label:  '已完结', value: 1
    }];
    private novelCatalogs: catalogType[] = [];
    private currentNovelId: number | null = null;
    private contentData: chapterType = {
        id: null,
        content: '',
        catalog_id: null
    };
    private editor: any;
    private recycleList: any[] = [];


    @Action('getMenuList')
    doGetMenuList() {
    }


    /**
     * 上传成功
     */
    onUploadSuccess(response: any, file: any, fileList: any) {
        if (response.error_code === 0) {
            const img_url  = url.replace('api/', 'uploads/') + response.data;
            $('.novel-upload .ivu-upload-drag').css({
                background: `url(${img_url}) no-repeat`,
                'background-size': 'cover'
            });
            this.postInfo.img = img_url;
        } else {
            this.$Message.error(response.message);
        }

    }

    /**
     * 上传失败
     */
    onUploadFailed(error: any, file: any, fileList: any) {
        this.$Message.error(error);
    }

    /**
     * 修改信息
     */
    updateNovelInfo() {
        const post = JSON.parse(JSON.stringify(this.postInfo));
        post.theme = post.theme.join('、');
        window.post('novel_update', post, (res: any) => {
            if (res.error_code === 0) {
                this.$Message.success('保存成功');
            } else {
                this.$Message.error('保存成功');
            }
        });
    }

    /**
     *  更改书名
     * @param {listType} data
     */
    updateNovelData(data: listType) {
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
     * 新增小说
     */
    addNovelData() {
        this.novelList.push({
            id: 0,
            name: '',
            type: 1,
            url: ''
        });
    }

    /**
     * 删除
     */
    deleteNovelData(id: number) {
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
     * 回收站
     */
    showDeletedNovels() {
        window.post('menu_recycle_list', {type: 1}, (res: any) => {
            if (res.error_code === 0) {
                this.currentPanel = 'recycle';
                this.$emit('panel', 'recycle');
                this.recycleList = res.data;
            } else {
                this.$Message.error('获取数据失败');
            }
        });
    }

    recycleNovel(id: number) {
        window.post('menu_recycle', {id: id}, (res: any) => {
            if (res.error_code === 0) {
                this.$Message.success('回收成功');
                this.showDeletedNovels();
            } else {
                this.$Message.error('回收失败');
            }
        });
    }

    /**
     * 章节管理
     */
    novelIndexManage(id: number) {
        this.currentNovelId = id;
        this.currentPanel = 'index';
        this.$emit('panel', 'index');
    }

    /**
     * 信息管理
     */
    novelInfoManage(id: number) {
        window.post('novel', {id: id}, (res: any) => {
            if (res.error_code === 0) {
                this.currentPanel = 'info';
                this.$emit('panel', 'info');
                this.postInfo = res.data;
                this.novelCatalogs = this.postInfo.catalog;
                this.postInfo.theme = this.postInfo.theme.split('、');
                this.$nextTick(() => {
                    $('.novel-upload .ivu-upload-drag').css({
                        background: `url(${this.postInfo.img}) no-repeat`,
                        'background-size': 'cover'
                    });
                });
            } else {
                this.$Message.error(res.message);
            }
        });
    }

    /**
     *  切换界面
     */
    changePanel(val: string) {
        this.currentPanel = val;
        if (val === 'list') {
            this.doGetMenuList();
        }
    }

    /**
     * 内容管理
     */
    novelContentManage(id: number) {
        window.post('chapter', {id: id}, (res: any) => {
            if (res.error_code === 0) {
                this.contentData = res.data;
                this.currentPanel = 'content';
                this.$emit('panel', 'content');
            } else {
                this.$Message.error(res.message);
            }
            this.$nextTick(() => {
                this.editor = new E('#toolbar', '#editor');
                this.editor.create();
                this.editor.txt.html(
                    '<p>' + this.contentData.content + '用 JS 设置的内容</p>'
                );
            });
        });
    }

    /**
     * 保存内容
     */
    addContentData() {
        this.contentData.content = this.editor.txt.html();
        window.post('chapter_update', this.contentData, (res: any) => {
            if (res.error_code === 0) {
                this.$Message.success('保存成功');
            } else {
                this.$Message.error(res.message);
            }
        });
    }

    /**
     * 修改章节名
     * @param data
     */
    updateIndexData(data: catalogType) {
        let post_url = '';
        if (data.id) {
            post_url = 'catalog_update';
        } else {
            post_url = 'catalog_create';
        }
        window.post(post_url, data, (res: any) => {
            if (res.error_code === 0) {
                this.$Message.success('保存成功');
                if (res.data) {
                    data.id = parseInt(res.data);
                }
            } else {
                this.$Message.error(res.message);
            }
        });
    }

    /**
     * 删除章节
     * @param id
     */
    deleteIndexData(id: number) {
        window.post('catalog_delete', {id: id}, (res: any) => {
            if (res.error_code === 0) {
                this.$Message.success('删除成功');
                if (this.currentNovelId) {
                    this.getCatalogs(this.currentNovelId);
                }
            } else {
                this.$Message.error(res.message);
            }
        });
    }

    getCatalogs(id: number) {
        window.post('catalog_list', {id: id}, (res: any) => {
            if (res.error_code === 0) {
                this.novelCatalogs = res.data;
            } else {
                this.$Message.error(res.message);
            }
        });
    }
    /**
     * 新增章节
     */
    addIndexData() {
        this.novelCatalogs.push({
            id: 0,
            name: '',
            novel_id: this.currentNovelId
        });
    }

    /**
     * 计算属性获取vuex中的游戏列表
     * @returns {getters.listenNovelList}
     */

    @Getter('listenNovelList') getNovelList: any;


    /**
     * watch 计算属性 赋值到data
     * @param {listType[]} val
     */
    @Watch('getNovelList')
    watchNovelList(val: listType[]) {
        this.novelList = val;
    }

}
</script>


<style lang="less">
.novel-upload {
  width: 200px;
  margin: auto;

  .ivu-upload-drag {
    height: 300px;
    line-height: 300px;
    background: transparent;

    .ivu-icon-ios-cloud-upload {
      opacity: 0.6;
    }
  }
}
</style>