<template>
    <div class="login-container">
        <div class="logo-container">
            <img src="https://s2.loli.net/2023/04/11/b8pzQZCJNeoSmyE.jpg" alt="logo" style="width: 100%; height: auto;">
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

export default {
    name: "PCLoginPage",
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
                    that.$cookies.set('user_type', res.data.data.type, 3600);
                    that.$router.push({path: '/home'})
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
            this.$router.push({path: "/register"});
        },
        openVerified() {
            for (var i in this.loginForm) {
                if (this.loginForm[i].trim().length == 0)
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
}

.logo-container {
    width: 100px;
    height: 100px;
    background: #ccc;
    margin-bottom: 20px;
    /* 添加20像素的下边距 */
    text-align: center;
}


.form-container {
    display: flex;
    /* 添加Flex属性 */
    justify-content: center;
    align-items: center;
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


