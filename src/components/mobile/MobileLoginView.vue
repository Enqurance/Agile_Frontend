<template>
    <div class="login-container">
        <div class="logo-container">
            <img src="/img/logo.png" alt="logo" style="width: 100%; height: auto;">
        </div>
        <div>
            <van-form :model="loginForm" class="login-form">
                <van-cell-group inset>
                    <van-field
                        v-model="loginForm.email" placeholder="请输入用户邮箱" @keyup.enter="openVerified"
                        name="用户邮箱" label="用户邮箱" :rules="[{ required: true, message: '请填写用户名' }]"
                    />
                    <van-field
                    type="password" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter="openVerified"
                        name="用户密码" label="用户密码" :rules="[{ required: true, message: '请填写密码' }]"
                    />
                </van-cell-group>
                <div style="margin: 16px;">
                    <el-button @click="goToRegister" style="margin-left: 15%;">注册</el-button>
                    <el-button type="primary" @click="openVerified" style="margin-left: 30%;">登录</el-button>
                </div>
            </van-form>
        </div>

        <ManVerify :is-show="isShow" @verified="closeVerified"/>
    </div>

</template>

<script>
import ManVerify from "@/components/sub_components/ManVerify.vue";
import global from "@/global";
import bus from "@/event-bus";

export default {
    name: "MobileLoginPage",
    components: {ManVerify},
    data() {
        return {
            loginForm: {
                email: "",
                password: "",
            },
            loginTitle: {
                email: "用户邮箱",
                password: "密码",
            },

            isShow: false
        };
    },

    methods: {
        login() {
            let that = this
            that.$axios.post('/auth/login', {
                email: that.loginForm.email,
                password: that.loginForm.password
            }).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    that.$cookies.set('user_token', res.data.data.token, 3600);
                    if (res.data.data.type === 0) {
                        that.$cookies.set('user_type', '0', 3600);
                    }
                    else {
                        that.$cookies.set('user_type', global.user_type_administrator, 3600);
                    }

                    that.$router.push({path: '/home'}).then(() => {
                        bus.emit('force-update-tabbar');
                    })
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((err) => {
                // console.log(err)
                // console.log(1)
                this.$message({
                    message: "网络错误",
                    type: 'error'
                })
                // console.log(res)
            })
        },
        goToRegister() {
            this.$router.push({path: "/register"})
        },
        openVerified() {
            for (var i in this.loginForm) {
                if (this.loginForm[i].trim().length === 0)
                    return this.$message.error(this.loginTitle[i] + "不能为空")
            }

            this.isShow = true
        },
        closeVerified() {
            this.isShow = false
            this.login()
        }
    },
};
</script>

<style>
.login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;

    /* 设置背景图片 */
    background-image: url(/public/img/background.png);
    /* 设置背景大小 */
    background-size: cover;
    /* 设置背景重复方式 */
    background-repeat: no-repeat;
    /* 设置背景位置 */
    background-position: center;
    /* 设置背景固定方式 */
    background-attachment: fixed;
}

.form-container {
    display: flex;
    /* 添加Flex属性 */
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    background-color:rgba(255,0,0,0);
}

.login-form {
    padding-top: 6%;
    flex: 1;
    /* 添加Flex属性 */
    background-color:rgba(255,0,0,0);
}

.button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 400px;
    margin: 0 auto;
}
</style>


