<template>
    <div class="register-container">
        <div class="logo-container">
            <img src="/img/logo.png" alt="logo" style="width: 100%; height: auto;">
        </div>
        <div>
            <p style="margin-top:0px; margin-bottom: 5px;" class="title">Register</p>
        </div>
        <div class="form-container">
            <el-form ref="registerForm" :model="registerForm" class="register-form">
                <el-form-item prop="username" :rules="usernameRules">
                    <el-input v-model="registerForm.username" placeholder="请设置用户名"
                              @keyup.enter="openVerified"></el-input>
                </el-form-item>

                <el-form-item prop="email" :rules="emailRules">
                    <el-input v-model="registerForm.email" placeholder="请输入验证邮箱"
                              @keyup.enter="openVerified"></el-input>
                </el-form-item>

                <div style="display:flex;">
                    <el-form-item prop="emailCode" style="width: 50%;padding-right: 110px;" :rules="emailCodeRules">
                        <el-input v-model="registerForm.emailCode" placeholder="请输入验证码"
                                  @keyup.enter="openVerified"></el-input>
                    </el-form-item>
                    <el-form-item prop="emailCodeBotton" style="flex: 1;">
                        <el-button :disabled="countdown > 0" type="primary" @click="sendEmailCode" class="button_left"  style="width: 100px;">
                            {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}}
                        </el-button>
                    </el-form-item>
                </div>

                <el-form-item prop="password1" :rules="passwordRules">
                    <el-input type="password" v-model="registerForm.password1" placeholder="请输入密码"
                              @keyup.enter="openVerified"></el-input>
                </el-form-item>
                <el-form-item prop="password2" :rules="password2Rules">
                    <el-input type="password" v-model="registerForm.password2" placeholder="请确认密码"
                              @keyup.enter="openVerified"></el-input>
                </el-form-item>

                <el-form-item prop="grade" :rules="gradeRules">
                    <el-select v-model="registerForm.grade" placeholder="请选择年级" class="el-select">
                        <el-option label="本科" value="1"></el-option>
                        <el-option label="硕士" value="2"></el-option>
                        <el-option label="博士" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="campus" :rules="campusRules">
                    <el-select v-model="registerForm.campus" placeholder="请选择校区" class="el-select">
                        <el-option label="学院路校区" value="1"></el-option>
                        <el-option label="沙河校区" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="gender" :rules="genderRules">
                    <el-radio v-model="registerForm.gender" label=0>男</el-radio>
                    <el-radio v-model="registerForm.gender" label=1>女</el-radio>
                </el-form-item>

                <el-form-item>
                    <el-button-group class="button_left">
                        <el-button type="primary" @click="goToLogin">返回登录</el-button>
                        <el-button type="primary" @click="openVerified"> 注册</el-button>
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
        <ManVerify @verified="closeVerified" :is-show="isShow" />
    </div>
</template>

<script>
import ManVerify from "@/components/sub_components/ManVerify.vue";
import { ElInput, ElFormItem, ElButtonGroup, ElSelect, ElButton, ElRadio, ElForm, ElOption} from "element-plus";

export default {
    name: "MobileRegisterPage",
    components: {
        ManVerify,
        ElInput,
        ElFormItem,
        ElButtonGroup,
        ElSelect,
        ElButton,
        ElRadio,
        ElForm,
        ElOption
    },
    data() {
        return {
            countdown: 0,
            registerForm: {
                username: "",
                email: "",
                emailCode: "",
                password1: "",
                password2: "",
                grade: "",
                campus: "",
                gender: -1,
            },

            isShow: false,

            usernameRules: [
                { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
                { min: 3, max: 20, message: '用户名长度为3-20位', trigger: ['blur', 'change'] }
            ],

            emailRules: [
                { required: true, message: '邮箱不能为空', trigger: ['blur', 'change'] },
                { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
            ],

            emailCodeRules: [
                { required: true, message: '验证码不能为空', trigger: ['blur', 'change'] },
                { pattern: /^\d{6}$/, message: '验证码必须为6位数字', trigger: ['blur', 'change'] }
            ],

            passwordRules: [
                { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
                { min: 8, max: 20, message: '密码长度为8-20位', trigger: ['blur', 'change'] },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/, message: '密码必须包含大写字母、小写字母和数字，且仅含有字母和数字', trigger: ['blur', 'change'] }
            ],

            password2Rules:[
                { required: true, message: '请再次输入密码', trigger: ['blur', 'change'] },
                { validator: (rule, value, callback) => {
                        if (value !== this.registerForm.password1) {
                            callback(new Error('两次输入的密码不一致！'))
                        } else {
                            callback()
                        }
                    }, trigger: ['blur', 'change'] }
            ],
            gradeRules:[{ required: true, message: '请选择年级', trigger: 'change' }],
            campusRules:[{ required: true, message: '请选择校区', trigger: 'change' }],
            genderRules:[
                {validator: (rule, value, callback) => {
                        if (value === -1) {
                            callback(new Error('请选择性别'));
                        } else {
                            callback();
                        }
                    },trigger: 'change'}
            ],
        };
    },

    methods: {
        sendEmailCode() {
            this.$refs.registerForm.validateField('email', error => {
                if (!this.registerForm.email) {
                    this.$message.error('请先输入邮箱');
                    return;
                }

                if (!error) {
                    this.$message.error('请输入正确的邮箱地址');
                    return;
                }

                console.log("发送")
                this.$axios.get('/auth/email', {
                    params: {
                        email: this.registerForm.email
                    }
                }).then((res) => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '验证码发送成功，请查收邮件',
                            type: 'success'
                        })
                        this.startCountdown();
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: 'error'
                        })
                    }
                }).catch((err) => {
                    // console.log(error)
                    this.$message({
                        message: err.response.data.message === null ? "验证码发送错误" : err.response.data.message,
                        type: 'error'
                    })
                })
            });
        },

        startCountdown() {
            this.countdown = 60;
            const interval = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
        },

        register() {

            let that = this

            that.$axios.post('/auth/register', {
                name: that.registerForm.username,
                email: that.registerForm.email,
                emailCode: that.registerForm.emailCode,
                password: that.registerForm.password1,
                grade: that.registerForm.grade,
                campus: that.registerForm.campus,
                gender: that.registerForm.gender,
            },)
                .then((res) => {
                    if (res.data.code === 200) {
                        that.$router.push({path: '/login'})
                    }
                    else {
                        alert(res.data.message)
                    }
                }).catch((res) => console.log(res))
        },

        goToLogin() {
            this.$router.push({path: "/login"});
        },

        openVerified() {
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    this.isShow = true
                }
            })
        },
        closeVerified() {
            this.isShow = false
            this.register()
        }
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

    /* 设置背景图片 */
    background-image: url(/public/img/background.png);
    /* 设置背景大小 */
    background-size: cover;
    /* 设置背景重复方式 */
    background-repeat: no-repeat;
    /* 设置背景位置 */
    background-position: center center;
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
    width: 80%;
    display: flex;
    /* 添加Flex属性 */
    justify-content: center;
    align-items: center;
    position: relative;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
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
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 20px; /* 圆角边框 */
}

.register-form {
    flex: 1; /* 添加Flex属性 */
    width: 80%;
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

.button_left {
    position: absolute;
    right: 0%;
}

.el-select {
    width: 100%;
}
.title{
    font-family: fantasy;
    font-size: 2.0em;
    color: #1f82ce;
}
</style>





