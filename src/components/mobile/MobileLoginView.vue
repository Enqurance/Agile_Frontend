<template>
    <div class="login-container">
        <div class="logo-container">
            <img src="/img/logo.png" alt="logo" style="width: 100%; height: auto;">
        </div>
        <div class="form-container">
            <el-form ref="loginForm" :model="loginForm" class="login-form">
                <el-form-item prop="email">
                    <el-input v-model="loginForm.email" placeholder="请输入用户邮箱" @keyup.enter="openVerified"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"
                              @keyup.enter="openVerified"></el-input>
                </el-form-item>

                <el-form-item>
                    <div class="button-container">
                        <el-button @click="goToRegister">注册</el-button>
                        <el-button type="primary" @click="openVerified">登录</el-button>
                    </div>
                </el-form-item>
            </el-form>
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

.logo-container {
    width: 180px;
    height: 180px;
    background: rgba(255, 255, 255, 0);
    margin-top: 0px;
    margin-bottom: 0px;
    text-align: center;
}

.form-container {
    display: flex;
    /* 添加Flex属性 */
    justify-content: center;
    align-items: center;
    position: relative;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 15px;
    padding-bottom: 0;
    z-index: 1;
}

.form-container:before {
    content: "";
    position: absolute;
    top: -10px; /* 向上移动一点 */
    bottom: -10px; /* 向下移动一点 */
    left: -10px; /* 向左移动一点 */
    right: -10px; /* 向右移动一点 */
    z-index: -1;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 20px; /* 圆角边框 */
}

.login-form {
    flex: 1;
    /* 添加Flex属性 */
}

.el-form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.el-form-item {
    width: 100%;
    text-align: center;
}

.button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 400px;
    margin: 0 auto;
}
</style>


