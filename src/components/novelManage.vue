<template>
    <div class="container" v-if="currentPanel === 'list'">
        <div class="row mb20" v-for="item in novelList" :key="item.id">
            <div class="ml20 pull-left mr20">
                <Input v-model="item.name" prefix="ios-book" size="large" placeholder="请输入小说名称" />
            </div>
            <ButtonGroup size="large">
                <Button type="success" class="ml20" @click="updateNovelData(item)">保存</Button>
                <Button type="warning" class="ml20" @click="deleteNovelData(item.id)">删除</Button>
                <Button type="info" class="ml20" @click="novelInfoManage(item.id)">信息管理</Button>
            </ButtonGroup>
        </div>

        <Button type="primary" size="large" class="ml20 f18" style="width: 415px" @click="addNovelData">新增</Button>

    </div>
    <div v-else-if="currentPanel === 'info'" class="text-center">
        <div class="novel-upload">
            <Upload
                    accept="image/*"
                    type="drag"
                    :max-size="2048"
                    :format="['jpg','jpeg','png']"
                    :action="url + '/server/main.php'"
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
                v-model="postInfo.Theme"
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
                v-model="postInfo.isEnd"
                style="width:200px"
                size="large"
                class="mb20"
                placeholder="完成状态"
        >
            <Option v-for="item in statusList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        <br/>
        <textarea v-model="postInfo.bDescribe" type="textarea" class="form-control" placeholder="简介" style="width: 400px; margin: auto"></textarea>
        <br/>
        <button class="btn btn-primary mt20" style="width: 200px" @click="updateNovelInfo">保存</button>
        <br/>
        <button class="btn btn-primary mt20" style="width: 200px" @click="novelIndexManage(postInfo.bNo)">章节管理</button>
    </div>
    <div v-else-if="currentPanel === 'index'" class="container" style="width:90%;margin:auto">
        <div class="row btn-group btn-group-lg">
            <button class="btn btn-primary" @click="addIndexData">新增</button>
        </div>
        <div class="row">
            <div class="mt20 col-xs-3 pl10" v-for="item in bookIndexes" :key="item.iNo">
                <div class="col-xs-12 input-group" >
                    <span class="input-group-addon"></span>
                    <input class="form-control" v-model="item.iName" />
                </div>
                <div class=" btn-group  col-xs-12">
                    <button class="btn btn-warning col-xs-4" @click="updateIndexData(item)">保存</button>
                    <button class="btn btn-danger col-xs-4" @click="deleteIndexData(item.iNo)">删除</button>
                    <button class="btn btn-info col-xs-4" @click="novelContentManage(item.iNo)">内容管理</button>
                </div>
            </div>

        </div>
    </div>
    <div v-else-if="currentPanel === 'content'" class="text-center">
        <div id="toolbar"></div>
        <div id="editor" style="height:600px;"></div>
        <div class="btn-group btn-group-lg mt20">
            <button class="btn btn-primary" style="width:200px" @click="addContentData">保存</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import fetch from "../libs/fetch";
import { Getter, Action } from "vuex-class";
import url from '../libs/urlConfig';

const E = require("wangeditor");

interface listType {
  id: number;
  name: string;
  type: number;
  url: string;
}

interface indexType {
  iNo: number | null;
  iName: string;
  bNo: number | null;
}

interface contentType {
  cNo: number | null;
  content: string;
  iNo: number | null;
}

@Component
export default class novelManage extends Vue {
  private novelList: listType[] = [];
  private currentPanel = "list";
  private url: string = url;
  private postInfo: any = {};
  private themeList: string[] = [
    "科幻",
    "灵异",
    "魔幻",
    "网游",
    "悬疑",
    "校园",
    "言情",
    "都市",
    "推理",
    "犯罪"
  ];
  private statusList: string[] = ["连载中", "已完结", "暂停更新"];
  private bookIndexes: indexType[] = [];
  private currentBookNo: number | null = null;
  private contentData: contentType = {
    cNo: null,
    content: "",
    iNo: null
  };
  private editor: any;

  @Action("getMenuList")
  doGetMenuList() {}

  @Action("getIndexList")
  doGetIndexList(val: any) {}

  /**
   * 上传成功
   */
  onUploadSuccess(response: any, file: any, fileList: any) {
    $(".novel-upload .ivu-upload-drag").css({
      background: "url('/server/uploads/" + response.data + "') no-repeat",
      "background-size": "cover"
    });
    this.postInfo.bookImg = "/server/uploads/" + response.data;
  }
  /**
   * 上传失败
   */
  onUploadFailed(error: any, file: any, fileList: any) {
    alert(error);
  }
  /**
   * 修改信息
   */
  updateNovelInfo() {
    const post = JSON.parse(JSON.stringify(this.postInfo));
    post.Theme = post.Theme.join("、");
    fetch("server/main.php", { novelInfo: post }, (res: any) => {
      if (res.data.code === 0) {
        alert("保存成功");
      } else {
        alert("保存失败");
      }
    });
  }

  /**
   *  更改书名
   * @param {listType} data
   */
  updateNovelData(data: listType) {
      if (!data.id) {
          const post = {
              name: data.name,
              type: 1,
              url: ''
          };
          window.post("menu_create", post, (res: any) => {
              if (res.error_code === 0) {
                  this.$Message.success('保存成功');
                  this.doGetMenuList;
              } else {
                  this.$Message.error('保存失败');
              }
          });
      } else {
          window.post("menu_update", data, (res: any) => {
              if (res.error_code === 0) {
                  this.$Message.success('保存成功');
                  this.doGetMenuList;
              } else {
                  this.$Message.error('保存失败');
              }
          });
      }
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
    fetch("server/main.php", { menuId: id }, (res: any) => {
      if (res.data.code === 0) {
        this.doGetMenuList;
      } else {
        alert("删除失败");
      }
    });
  }
  /**
   * 章节管理
   */
  novelIndexManage(id: number) {
    this.currentBookNo = id;
    this.doGetIndexList(this.currentBookNo);
    this.currentPanel = "index";
    this.$emit("panel", "index");
  }

  /**
   * 信息管理
   */
  novelInfoManage(id: number) {
    fetch("server/main.php", { bookId: id }, (res: any) => {
      this.currentPanel = "info";
      this.$emit("panel", "info");
      if (res.data.code === 0) {
        this.postInfo = res.data.data;
        this.postInfo.Theme = this.postInfo.Theme.split("、");
        this.$nextTick(() => {
          $(".novel-upload .ivu-upload-drag").css({
            background: "url('" + this.postInfo.bookImg + "') no-repeat",
            "background-size": "cover"
          });
        });
      } else {
        this.postInfo = {
          bNo: 0,
          Theme: [],
          bDescribe: "",
          bookImg: "",
          isEnd: "",
          mId: id
        };
      }
    });
  }

  /**
   *  切换界面
   */
  changePanel(val: string) {
    this.currentPanel = val;
  }

  /**
   * 内容管理
   */
  novelContentManage(id: number) {
    fetch("server/main.php", { iNo: id }, (res: any) => {
      this.currentPanel = "content";
      this.$emit("panel", "content");
      if (res.data.code === 0) {
        this.contentData = res.data.data;
      } else {
        this.contentData = {
          cNo: 0,
          content: "",
          iNo: id
        };
      }
      this.$nextTick(() => {
        this.editor = new E("#toolbar", "#editor");
        this.editor.create();
        this.editor.txt.html(
          "<p>" + this.contentData.content + "用 JS 设置的内容</p>"
        );
      });
    });
  }
  /**
   * 保存内容
   */
  addContentData() {
    this.contentData.content = this.editor.txt.html();
    fetch("server/main.php", { contentData: this.contentData },(res: any) => {
        if (res.data.code === 0) {
          alert("保存成功");
        } else {
          alert("保存失败");
        }
      });
  }
  /**
   * 修改章节名
   * @param data
   */
  updateIndexData(data: indexType) {
    fetch("server/main.php", { indexData: data }, (res: any) => {
      if (res.data.code === 0) {
        alert("保存成功");
        this.doGetIndexList(this.currentBookNo);
      } else {
        alert("保存失败");
      }
    });
  }
  /**
   * 删除章节
   * @param id
   */
  deleteIndexData(id: number) {
    fetch("server/main.php", { indexId: id }, (res: any) => {
      if (res.data.code === 0) {
        this.doGetIndexList(this.currentBookNo);
      } else {
        alert("删除失败");
      }
    });
  }
  /**
   * 新增章节
   */
  addIndexData() {
    this.bookIndexes.push({
      iNo: 0,
      iName: "",
      bNo: this.currentBookNo
    });
  }

  /**
   * 计算属性获取vuex中的游戏列表
   * @returns {getters.listenNovelList}
   */

  @Getter("listenNovelList") getNovelList: any;

  @Getter("listenIndexList") getIndexList: any;
  /**
   * watch 计算属性 赋值到data
   * @param {listType[]} val
   */
  @Watch("getNovelList")
  watchNovelList(val: listType[]) {
    this.novelList = val;
  }
  @Watch("getIndexList")
  watchIndexList(val: indexType[]) {
    this.bookIndexes = val;
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