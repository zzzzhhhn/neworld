<template>
    <div class="app-sign">
        <el-form ref="form_signup" :model="formValidate" :rules="ruleValidate" :label-width="0">
            <<el-form-item label="" prop="account" class="mb30">
                <el-input v-model="formValidate.account" prefix="md-person" size="large" placeholder="账号应为3~9位字母或数字" />
            </el-form-item>
            <<el-form-item label="" prop="password" class="mb30">
                <el-input v-model="formValidate.password" prefix="md-lock" type="password" size="large" placeholder="密码应为6~16位字母或数字" />
            </el-form-item>
            <<el-form-item label="" prop="re_password" class="mb30">
                <el-input v-model="formValidate.re_password" prefix="md-lock" type="password" size="large" placeholder="请再次输入密码" />
            </el-form-item>
            <<el-form-item label="" prop="" class="text-center">
              <el-el-button-group size="large" class="w100">
                <el-button type="primary" @click="handleSubmit" class="w50">提交</el-button>
                <el-button @click="handleReset" class="w50">重置</el-button>
              </el-el-button-group>

            </el-form-item>
        </el-form>

    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import md5 from 'md5';
    import moment from 'moment';

    @Component
    export default class signUp extends Vue {

        private formValidate = {
            account: '',
            password: '',
            re_password: ''
        };

        private ruleValidate = {
            account: [
                {require: true, massage: '账号不能为空'},
                {pattern: /^[a-zA-Z0-9]{3,9}$/, message: '账号应为3~9位汉字、字母或数字'}
            ],
            password: [
                {require: true, massage: '密码不能为空'},
                {pattern: /^[a-zA-Z0-9]{6,16}$/, message: '密码应为6~16位字母或数字'}
            ],
            re_password: [
                {require: true, massage: '密码不能为空'},
                {pattern: /^[a-zA-Z0-9]{6,16}$/, message: '密码应为6~16位字母或数字'},
                {validator: this.valiConfirmPwd, message: '两次输入的密码不一致'}
            ],
        }
        private isPosting: boolean = false;
        private postCount: number = 0;

        valiConfirmPwd(rule: any, value: string, callback: Function) {
            if (value !== this.formValidate.password) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        }

        handleSubmit() {
            (<Vue>this.$refs.form_signup).validate((result: boolean) => {
                if (result) {
                    if (this.isPosting) {
                        return this.$message.warning('你太快了，受不了！')
                    }
                    this.postCount = parseInt(localStorage.getItem('signUpPostCount') || '0');
                    if (this.postCount > 5) {
                        const last_time = localStorage.getItem('signUpPostTime') || moment().format('YYYY-MM-DD HH:mm:ss');
                        if (moment().diff(last_time, 'days') < 1) {
                            return this.$message.error('服务器累了，明天再来吧');
                        } else {
                            this.postCount = 0;
                        }
                    }
                    this.isPosting = true;
                    this.postCount++;
                    localStorage.setItem('signUpPostCount', this.postCount.toString());
                    localStorage.setItem('signUpPostTime', moment().format('YYYY-MM-DD HH:mm:ss'));
                    const password = md5(this.formValidate.password);
                    window.post('signup', {account: this.formValidate.account, password: password}, (res: any) => {
                        if (res.error_code === 0) {
                            setTimeout(() => {
                                this.isPosting = false;
                            }, 1000);
                            this.$message.success('注册成功');
                            this.$emit('success');
                        }else {
                            this.$message.error(res.message);
                        }
                    })
                }
            })
        }

        handleReset() {
            (<Vue>this.$refs.form_signup).resetFields();
        }




    }
</script>


<style lang="less">
    .app-sign {
        width: 100%;
        padding: 10% 20%;
    }
</style>
