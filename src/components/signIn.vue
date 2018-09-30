<template>
    <div class="app-sign">
        <Form ref="form_signup" :model="formValidate" :label-width="0">
            <FormItem label="" prop="account">
                <Input v-model="formValidate.account" prefix="md-lock" size="large" placeholder="请输入账号" />
            </FormItem>
            <FormItem label="" prop="password">
                <Input v-model="formValidate.password" prefix="md-lock" type="password" size="large" placeholder="请输入密码" />
            </FormItem>
            <FormItem label="" prop="" class="text-center">
                <Button type="primary" @click="handleSubmit">登录</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts">
  import fetch from '../libs/fetch';
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
  import { Action } from 'vuex-class';
  import md5 from 'md5';

    @Component
    export default class signIN extends Vue {

    private formValidate = {
        account: '',
        password: ''
    };

        @Action('getUserData')
        doGetUserData(val: any){};

        handleSubmit() {
            const password = md5(this.formValidate.password);
            window.post('signin', {account: this.formValidate.account, password: password}, (res: any) => {
                if (res.error_code === 0) {
                    this.doGetUserData(res.data);
                    this.$emit('success');
                } else {
                    this.$Message.error(res.message);
                }
            })
        }

    }
</script>


<style lang="less">
    .app-sign {
        * {
            box-sizing: border-box;
        }

        .btn-sign-in,
        .input-group {
            width: 50%;
            margin: 50px 25% 0;

        }

        .alert {
            width: 50%;
            margin: 0px 25% -50px;
            box-sizing: border-box;
            height: 50px;
            line-height: 1;
        }

    }

    .btn-sign-in {
        button {
            width: 100%;
        }
    }
</style>