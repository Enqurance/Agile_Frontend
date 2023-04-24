<script>
import PageHeader from './PageHeader.vue'
import {ref, reactive} from 'vue'

export default {
    components: {PageHeader},
    setup() {
        // information:
        const user = reactive({
            id: 0,
            name: "initial",
            email: 'initial' + "@buaa.edu.cn",
            type: 0,
            password: 'initial',
            icon: "../assets/ava.png",
            campus: "initial",
            grade: "initial",
            gender: 0,
            description: "tell you later .",
        });
        const tempUser = reactive({
            name: "initial",
            icon: "../assets/ava.png",
            campus: "initial",
            grade: "initial",
            gender: 0,
            description: "tell you later .",
        });

        // password:
        const curPassword = ref('');
        const newPassword = ref('');
        const tempPassword = ref('');

        const editVisible = ref(false);
        const changePasswordVisible = ref(false);
        const imageUrl = ref('');

        return {
            user, tempUser,
            curPassword, newPassword, tempPassword,
            editVisible, changePasswordVisible, imageUrl,
        };
    },
    mounted() {
        this.initInfor();
    },
    methods: {
        initInfor() {
            let that = this;
            // console.log(that.$cookies.get('user_token'));
            that.$axios.get('user/getUserByToken', {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res);
                this.user.id = res.data.data.id;
                this.user.name = res.data.data.name;
                this.user.email = res.data.data.email;
                this.user.type = res.data.data.type;
                this.user.password = res.data.data.password;
                this.user.icon = res.data.data.icon;
                this.user.campus = res.data.data.campus;
                this.user.grade = res.data.data.grade;
                this.user.gender = res.data.data.gender;
                this.user.description = res.data.data.description;
                // console.log(this.user);
                this.refreshTempUser();
            }).catch((res) => console.log(res));
        },
        refreshTempUser() {
            this.tempUser.name = this.user.name;
            this.tempUser.campus = this.user.campus;
            this.tempUser.grade = this.user.grade;
            this.tempUser.gender = this.user.gender;
            this.tempUser.description = this.user.description;
        },
        updateEdit() {
            // console.log(this.user);
            let that = this;
            that.$axios.post('user/changeUserBasicByToken',
                {
                    name: this.user.name,
                    campus: this.user.campus,
                    grade: this.user.grade,
                    gender: this.user.gender,
                    description: this.user.description,
                },
                {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    },
                }).then((res) => {
                // console.log(res);
            }).catch((res) => console.log(res))
        },
        editConfirm() {
            // console.log("in confirm!");
            this.user.name = this.tempUser.name;
            this.user.campus = this.tempUser.campus;
            this.user.grade = this.tempUser.grade;
            this.user.gender = this.tempUser.gender;
            this.user.description = this.tempUser.description;
            this.editVisible = false;
            this.updateEdit();
        },
        editCancel() {
            // console.log("in cancel!");
            this.refreshTempUser();
            this.editVisible = false;
        },

        changePassword() {
            // console.log(this.curPassword)
            this.$axios.post('user/changePasswordByToken',
                {
                    password: this.curPassword,
                    newPassword: this.newPassword,
                },
                {
                    headers: {
                        'token': this.$cookies.get('user_token')
                    },
                }).then((res) => {
                    console.log(res)
                    if (res.data.code === 200) {
                        this.$message({
                            message: "修改成功",
                            type: 'success'
                        })
                    }
                    else {
                        this.$message({
                            message: res.data.message,
                            type: 'error'
                        })
                    }
                // console.log(res);
            }).catch((res) => console.log(res))
        },
        chPaConfirm() {
            if (this.newPassword !== this.tempPassword) {
                this.$message({
                    message: "两次新密码不一致",
                    type: 'error'
                })
            }
            else {
                this.changePassword();
            }
        },
        chPaCancel() {
            this.changePasswordVisible = false;
        },

        beforeAvatarUpload(file) {
            console.log("in beforeAvatarUpload!");
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                console.log('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                console.log('上传头像图片大小不能超过 2MB!');
            }
            let formData = new FormData()
            formData.append('pic', file)
            let that = this;
            console.log("before axio!");
            that.$axios.post('photo/uploadUserIcon',
                {
                    formData
                },
                {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    },
                }).then((res) => {
                // console.log(res);
            }).catch((res) => console.log(res))
        },

        handleAvatarSuccess(res, file) {
            console.log(file)
        },
    },
    data() {
        return {}
    }
}
</script>

<template>
    <div class="InforPage">
        <div class="header">
            <PageHeader/>
        </div>
        <el-container class="MainPart">
            <el-header height="30%">
                <div class="headPart">
                    <div>
                        <el-avatar size='large' class="avatar" src="https://s2.loli.net/2023/04/24/FSTIwHVaPsYi1tl.jpg"/>
                        <span style="margin-left: 15%">{{this.user.name}}</span>
                    </div>
                    <div class="buttonArea">
                        <div style="padding-top: 20%"></div>
                        <el-button round @click="editVisible = true">编辑</el-button>
                        <el-button round>
                            <el-dropdown>
              <span class="el-dropdown-link">
                设置
                <el-icon class="el-icon--right">
                  <arrow-down/>
                </el-icon>
              </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>
                                            <el-button @click="changePasswordVisible = true">修改密码</el-button>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-button>登出</el-button>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-button>
                    </div>
                </div>
                <el-divider/>
            </el-header>
            <el-container>
                <el-aside width="30%" >
                    <div class="LeftPart">
                        <el-row class="firstRow">
                            <p style="padding-bottom: 5%; font-size:1.5em">{{ user.description }}</p>
                            <el-descriptions column=1>
                                <el-descriptions-item label="校区:">{{ user.campus }}</el-descriptions-item>
                                <el-descriptions-item label="年级:">{{ user.grade }}</el-descriptions-item>
                                <el-descriptions-item label="性别:">
                                    <span v-if="user.gender == 0">男</span>
                                    <span v-if="user.gender == 1">女</span>    
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-row>
                        <el-row class="secondRow">
                            <el-divider content-position="left">成就</el-divider>
                            <el-scrollbar>
                                <div class="scrollbar-flex-content">
                                    <p v-for="item in 10" :key="item" class="scrollbar-demo-item">
                                        <a href="https://smms.app/image/ROAPa7U2NqCz3o8" target="_blank"><img class="achImg" src="https://s2.loli.net/2023/04/24/ROAPa7U2NqCz3o8.png" alt="238827fc25b9feb5c544964b6737d91.png"></a>
                                    </p>
                                </div>
                            </el-scrollbar>
                        </el-row>
                        <el-row class="thirdRow">
                            <el-divider content-position="left">标签</el-divider>
                            <el-tag>Tag 1</el-tag>
                            <el-tag class="ml-2" type="success">Tag 2</el-tag>
                            <el-tag class="ml-2" type="info">Tag 3</el-tag>
                            <el-tag class="ml-2" type="warning">Tag 4</el-tag>
                        </el-row>
                    </div>
                </el-aside>
                <el-main>
                    <div>
                        <el-upload
                                class="avatar-uploader"
                                action="/api/photp/uploadUserIcon"
                                :show-file-list="true"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                        >
                            <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus/>
                            </el-icon>
                        </el-upload>
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <!--edit Dialog-->
        <el-dialog
                v-model="editVisible"
                title="请编辑你的信息"
                width="50%"
        >
            <el-form :model="user" label-width="120px">
                <el-form-item label="用户名">
                    <el-input v-model="tempUser.name"/>
                </el-form-item>
                <el-form-item label="校区">
                    <el-input v-model="tempUser.campus"/>
                </el-form-item>
                <el-form-item label="年级">
                    <el-input v-model="tempUser.grade"/>
                </el-form-item>
                <el-form-item label="个人描述">
                    <el-input v-model="tempUser.description"/>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="tempUser.gender">
                      <el-radio :label="0">男</el-radio>
                      <el-radio :label="1">女</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel">取消</el-button>
          <el-button type="primary" @click="editConfirm">
            确认
          </el-button>
        </span>
            </template>
        </el-dialog>
        <!--changePassword Dialog-->
        <el-dialog
                v-model="changePasswordVisible"
                title="修改密码"
                width="30%"
        >
            <el-form :model="user" label-width="120px">
                <el-form-item label="请输入当前密码">
                    <el-input v-model="curPassword"/>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input v-model="newPassword"/>
                </el-form-item>
                <el-form-item label="确认新密码">
                    <el-input v-model="tempPassword"/>
                </el-form-item>
            </el-form>
            <template #footer>
        <span class="dialog-footer">
          <el-button @click="chPaCancel">取消</el-button>
          <el-button type="primary" @click="chPaConfirm">
            确认
          </el-button>
        </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.InforPage {
    width: 100%;
    height: 100%;
    padding-left: 2%;
    padding-right: 2%;
    display: block;
}

.header {
    height: 7%;
    display: block;
}

.headPart {
    width: 100%;
    display: flex;
    padding-top: 3%;
    flex-direction: row;
    margin-right: 2%;
    background-image: url('https://s2.loli.net/2023/04/24/TmzbRhHcDe2x5FP.png');
}

.headPart > div {
    flex: 1;
    vertical-align: bottom;
}

.buttonArea {
    margin-left: 30%;
}

.MainPart {
    height: 100%;
    width: 100%;
    position: fixed;
}

.LeftPart {
    margin-left: 8%;
    border-right-width: thin;
    border-right-style: double;
    border-right-color: gainsboro;
}

.avatar {
    margin-top: 10%;
    margin-bottom: 2%;
    margin-left: 5%;
}

.firstRow {
    margin-bottom: 10%;
    display: block;
    align-items: center;
}

.secondRow {
    margin-right: 8%;
    margin-bottom: 10%;
}

.thirdRow {
    margin-right: 8%;
    margin-bottom: 10%;
}

.scrollbar-flex-content {
    display: flex;
}

.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 30px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
}

.achImg{
    height: 100%;
    width: 100%;
}

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.ml-2 {
    margin-left: 3%;
}

p.desc {
    text-align-last: center;
}

#body {
    margin-top: 10%;
    height: 20px;
    width: 20px;
}

.ul {
    margin-top: 10%;
}

.left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 2%;
    margin-right: 20%;
}

.right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 20%;
    margin-right: 2%;
}

.li {
    border: 0;
    font-family: inherit;
    font-size: 100%;
    font-weight: 400;
    font-style: normal;
    line-height: 1.55;
    display: list-item;
    text-align: -webkit-match-parent;
}

span {
    font-size: 120%;
}

a {
    font-size: 120%;
    font-weight: 550;
}
</style>