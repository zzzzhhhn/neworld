<template>
    <div>
        <div class="novel-contain">
            <div class="novel-img"><img :src="novelData.img" width="200px" height="300px"/></div>
            <div class="msg-contain">
                <div class="novel-msg"><span>题材： </span>{{novelData.theme}}</div>
                <div class="novel-msg"><span>创作状态： </span>{{statusList[novelData.is_end]}}</div>
                <div class="novel-describe"><div>简介：</div><div class="describe-content">{{novelData.description}}</div></div>
                <!--<Button type="primary" class="mr20" @click="onBeginReading(novelData.indexes[0])">开始阅读</button>-->
                <!--<Button type="warning">继续阅读</button>-->
            </div>
        </div>

        <div class="novel-indexes">
            <h1>目录</h1>
          
            <Tag :color="colors[Math.floor(Math.random() * 16)]" class="tag-catalogs" v-for="item in novelData.catalog" :key="item.id" @click.native="onBeginReading(item)">{{item.name}}</Tag>
        </div>

    </div>
</template>

<script lang="ts">
 import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    @Component({})
    export default class panelMenu extends Vue {
        @Prop({
            type: Object,
            default: {}
        })novelData: any;
        
        private colors = ['primary', 'success', 'error', 'warning', 'magenta', 'red', 'volcano', 'orange', 'gold', 'yellow', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
        
        private statusList =
            {
                0: '连载中', 1: '已完结'
            };

        onBeginReading(indexObj: any) {
            this.$emit('read', indexObj);
        }
         
        
    }

</script>

<style scoped lang="less">
    .novel-contain {
        display: flex;
        padding-left: 10%;

        .novel-img {
            width: 200px;
            height: 300px;
            flex: none;
            margin-top: 20px;

        }
        .msg-contain {
            flex: auto;
            padding-left: 30px;

            button {
                font-size: 20px;
                text-shadow: 0 0 10px gray;
            }

            .novel-msg {
                margin-top: 20px;
                height: 30px;
                line-height: 30px;
                font-size: 24px;
                color: gray;
                span {
                    color: #111;
                    font-size: 30px;
                }
            }

            .novel-describe {
                width: 80%;
                font-size: 30px;
                color: #111;
                margin: 20px 0;

                .describe-content {
                    margin-top: 10px;
                    font-size: 24px;
                    color: gray;
                    height: 100px;
                    overflow-y: auto;
                }

            }
        }

    }

    .novel-indexes {
        padding: 0 10%;
        color: #333;
        font-size: 20px;
      
    }
.tag-catalogs {
            cursor: pointer;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 10px;
            font-size: 20px;
        }
</style>