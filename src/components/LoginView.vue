<template>
  <div class="login-container">
    <div class="logo-container">
      <img src="https://s2.loli.net/2023/04/11/b8pzQZCJNeoSmyE.jpg" alt="logo" style="width: 100%; height: auto;">
    </div>
    <div class="form-container">
      <el-form ref="loginForm" :model="loginForm" class="login-form">
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入用户邮箱" @keyup.enter="login"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter="login"></el-input>
        </el-form-item>

        <el-form-item>
          <div class="button-container">
            <el-button @click="goToRegister">注册</el-button>
            <el-button type="primary" @click="login">登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import global from '@/global'

export default {
  name: "LoginPage",
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
    };
  },

  methods: {
    login() {
      for (var i in this.loginForm) {
        if (this.loginForm[i].trim().length == 0)
          return this.$message.error(this.loginTitle[i] + "不能为空")
      }

      let that = this
      that.$axios.post('/auth/login', {
        email: that.loginForm.email,
        password: that.loginForm.password
      }).then((res) => {
        if (res.data.state) {
          global.global_user_id = res.data.id
          global.global_type = false
          that.$router.push({ path: '/home' })
        } else {
          alert(res.data.message)
        }
      }).catch((res) => console.log(res))
    },

    goToRegister() {
      this.$router.push({ path: "/register" });
    },
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


