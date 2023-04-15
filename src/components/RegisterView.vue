<template>
  <div class="register-container">
    <div class="logo-container">
      <img src="https://s2.loli.net/2023/04/11/b8pzQZCJNeoSmyE.jpg" alt="logo" style="width: 100%; height: auto;">
    </div>
    <div class="form-container">
      <el-form ref="registerForm" :model="registerForm" class="register-form">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请设置用户名" @keyup.enter="register"></el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入验证邮箱" @keyup.enter="register"></el-input>
        </el-form-item>

        <el-form-item prop="emailCode"> 
          <el-input v-model="registerForm.emailCode" placeholder="请输入验证码" @keyup.enter="register"></el-input>
        </el-form-item>

        <el-form-item prop="emailCodeBotton"> 
          <el-button type="primary" @click="sendEmailCode"  class="button_left">发送验证码</el-button>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="registerForm.password1" placeholder="请输入密码" @keyup.enter="register"></el-input>
        </el-form-item>
        <el-form-item prop="confirm">
          <el-input type="password" v-model="registerForm.password2" placeholder="请确认密码" @keyup.enter="register"></el-input>
        </el-form-item>

        <el-form-item prop="grade">
          <el-select v-model="registerForm.grade" placeholder="请选择年级">
            <el-option label="本科" value="1"></el-option>
            <el-option label="硕士" value="2"></el-option>
            <el-option label="博士" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="campus">
          <el-select v-model="registerForm.campus" placeholder="请选择校区">
            <el-option label="学院路校区" value="1"></el-option>
            <el-option label="沙河校区" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-radio v-model="registerForm.gender" label=0>男</el-radio>
          <el-radio v-model="registerForm.gender" label=1>女</el-radio>
        </el-form-item>

        <el-form-item>
          <el-button-group class="button_left">
            <el-button type="primary" @click="goToLogin">返回登录</el-button>
            <el-button type="primary" @click="register">  注册  </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import global from '@/global'

export default {
  name: "registerPage",
  data() {
    return {
      registerForm: {
        username: "",
        email:"",
        emailCode:"",
        password1: "",
        password2: "",
        grade: "",
        campus: "",
        gender: -1,
      },

      registerTitle: {
        username: "用户名",
        email:"验证邮箱",
        emailCode:"邮箱验证码",
        password1: "密码",
        password2: "确认密码",
        grade: "年级",
        campus: "校区",
        gender: "性别",
      },
    };
  },

  methods: {
    sendEmailCode() {
      this.$axios.get('/auth/email', {
      params: {
        email: this.registerForm.email
      }
      }).then(() => {
        this.$message({
        message: '验证码发送成功，请查收邮件',
        type: 'success'
        })
      }).catch((error) => {
        console.log(error)
        this.$message({
        message: '验证码发送失败，请重试',
        type: 'error'
        })
      })
    },


    register() { 
      for (var i in this.registerForm) {
        if (this.registerTitle[i] === "性别" && this.registerForm[i] === -1) {
          return this.$message.error(this.registerTitle[i] + "不能为空")
        } else if (this.registerForm[i].trim().length == 0) {
          return this.$message.error(this.registerTitle[i] + "不能为空")
        }
      }
      if (this.registerForm.password1 !== this.registerForm.password2) {
          return this.$message.error('请重新检查，两次输入的密码不一致！')
      }

      let that = this
      const payload = {
        username: that.registerForm.username,
        email: that.registerForm.email,
        emailCode: that.registerForm.emailCode,
        password: that.registerForm.password1,
        grade: that.registerForm.grade,
        campus: that.registerForm.campus,
        gender: that.registerForm.gender,
      };

      console.log('注册信息：', payload);

      that.$axios.post('/auth/register', payload)
        .then((res) => {
        if (res.data.state) {
          global.global_user_id = res.data.id
          global.global_type = false
          that.$router.push({ path: '/home' })
        } else {
          alert(res.data.message)
        }
      }).catch((res) => console.log(res))
    },

    goToLogin() {
      this.$router.push({ path: "/login" });
    },
  },
};
</script>
  
<style>
.register-container {
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
    margin-bottom: 20px; /* 添加20像素的下边距 */
    text-align: center;
}

.form-container {
  display: flex; /* 添加Flex属性 */
  justify-content: center;
  align-items: center;
}

.register-form {
  flex: 1; /* 添加Flex属性 */
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

.button_left{
  position:absolute;
  right: 0%;
}
</style>





