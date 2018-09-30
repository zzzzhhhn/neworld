<template>
    <div class="app-sign">
        <Form ref="form_signup" :model="formValidate" :rules="ruleValidate" :label-width="0">
            <FormItem label="" prop="account">
                <Input v-model="formValidate.account" prefix="md-person" size="large" placeholder="账号应为3~9位字母或数字" />
            </FormItem>
            <FormItem label="" prop="password">
                <Input v-model="formValidate.password" prefix="md-lock" type="password" size="large" placeholder="密码应为6~16位字母或数字" />
            </FormItem>
            <FormItem label="" prop="re_password">
                <Input v-model="formValidate.re_password" prefix="md-lock" type="password" size="large" placeholder="请再次输入密码" />
            </FormItem>
            <FormItem label="" prop="" class="text-center">
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button @click="handleReset" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>

    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import md5 from 'md5';

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
                    const password = md5(this.formValidate.password);
                    window.post('signup', {account: this.formValidate.account, password: password}, (res: any) => {
                        if (res.error_code === 0) {
                            this.$Message.success('注册成功');
                            this.$emit('success');
                        }else {
                            this.$Message.error(res.message);
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