<template>
    <div class="app-sign">
        <el-form ref="form_signup" :rules="ruleValidate" :model="formValidate" :label-width="0">
            <el-form-item label="" prop="account" class="mb30">
                <el-input v-model="formValidate.account" prefix="md-lock" size="large" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="" prop="password" class="mb30">
                <el-input v-model="formValidate.password" prefix="md-lock" type="password" size="large" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="" prop="" class="text-center">
                <el-button type="primary" @click="handleSubmit" class="w100" size="medium">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
    import moment from 'moment';
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import { Action } from 'vuex-class';
    import md5 from 'md5';

    @Component
    export default class signIN extends Vue {

        private formValidate = {
            account: '',
            password: ''
        };
        private isPosting: boolean = false;
        private postCount: number = 0;
        private ruleValidate = {
            account: [
                {required: true, message: '账号不能为空', trigger: 'change'},
                {pattern: /^[a-zA-Z0-9]{3,9}$/, message: '账号应为3~9位汉字、字母或数字', trigger: 'change'}
            ],
            password: [
                {required: true, message: '密码不能为空', trigger: 'change'},
                {pattern: /^[a-zA-Z0-9]{6,16}$/, message: '密码应为6~16位字母或数字', trigger: 'change'}
            ],
        };
        @Action('getUserData')
        doGetUserData(val: any){};

        handleSubmit() {
            (<Vue>this.$refs.form_signup).validate((result: boolean) => {
                if (result) {
                    if (this.isPosting) {
                        return this.$message.warning('你太快了，受不了！')
                    }
                    this.postCount = parseInt(localStorage.getItem('signInPostCount') || '0');
                    if (this.postCount > 5) {
                        const last_time = localStorage.getItem('signInPostTime') || moment().format('YYYY-MM-DD HH:mm:ss');
                        if (moment().diff(last_time, 'days') < 1) {
                            return this.$message.error('服务器累了，明天再来吧');
                        } else {
                            this.postCount = 0;
                        }
                    }
                    this.isPosting = true;
                    this.postCount++;
                    localStorage.setItem('signInPostCount', this.postCount.toString());
                    localStorage.setItem('signInPostTime', moment().format('YYYY-MM-DD HH:mm:ss'));
                    const password = md5(this.formValidate.password);
                    window.post('signin', {account: this.formValidate.account, password: password}, (res: any) => {
                        if (res.error_code === 0) {
                            setTimeout(() => {
                                this.isPosting = false;
                            }, 1000);
                            this.doGetUserData(res.data);
                            sessionStorage.setItem('zw_token', res.data.token);
                            this.$emit('success');
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }
            });
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
        el-button {
            width: 100%;
        }
    }
</style>
