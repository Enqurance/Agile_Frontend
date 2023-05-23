<script>
import { ref, reactive } from 'vue'
import MyPin_Mobile from './MyPin_Mobile.vue'
import bus from "@/event-bus";

export default {
    name: "MyInfo_Mobile",
    components: { MyPin_Mobile },
    inject: ['reload'],
    setup() {
        // information:
        const user = reactive({
            id: 0,
            name: "initial",
            email: 'initial' + "@buaa.edu.cn",
            type: 0,
            password: 'initial',
            icon: '',
            campus: "initial",
            grade: "initial",
            gender: 0,
            description: "tell you later .",
        });
        const tempUser = reactive({
            name: "initial",
            icon: '',
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

        const contactUsVisible = ref(false);
        const suggestion = ref('');

        const show = ref(false);
        const showLeft = () => {
            show.value = true;
        };

        const tags = ref([
            { name: '绿园', type: '' },
            { name: '美食', type: 'success' },
            { name: 'Tag 3', type: 'info' },
            { name: 'Tag 4', type: 'warning' },
        ]);

        return {
            editVisible, user, tempUser,
            changePasswordVisible, curPassword, newPassword, tempPassword,
            imageUrl, tags,
            contactUsVisible, suggestion,
            show, showLeft,
        };
    },
    mounted() {
        this.initInfor();
    },
    methods: {
        getIcon() {
            let that = this;
            that.$axios.get('user/getIcon',
                {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    },
                }).then((res) => {
                    //console.log(res);
                    this.user.icon = res.data.data;
                    this.imageUrl = res.data.data;
                    //console.log(this.user.icon);
                }).catch((res) => console.log(res))

            this.refreshIcon();
        },
        refreshIcon() {
            this.isReload = false;
            this.$nextTick(() => {
                this.isReload = true;
            })
        },

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
            this.getIcon();
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

            // console.log("reload");
            // this.$router.go(0);
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
            let that = this
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
                    // console.log(res)
                    if (res.data.code === 200) {
                        this.$message({
                            message: "修改成功",
                            type: 'success'
                        })
                        that.$cookies.remove('user_token')
                        that.$cookies.remove('user_type')
                        that.$router.push({ path: '/login' })
                    }
                    else {
                        this.$message({
                            message: res.data.message,
                            type: 'error',
                            grouping: true
                        })
                    }
                    // console.log(res);
                }).catch((res) => console.log(res))
        },
        chPaConfirm() {
            console.log("chpaConfirm")
            if (this.newPassword !== this.tempPassword) {
                this.$message({
                    message: "两次新密码不一致",
                    type: 'error',
                    grouping: true
                })
            }
            else {
                this.changePassword();
            }
        },
        chPaCancel() {
            this.changePasswordVisible = false;
        },

        coUsConfirm() {
            let that = this;
            that.$axios.post('user/suggestByToken',
                {
                    suggestion: this.suggestion
                },
                {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    },
                }).then((res) => {
                    // console.log(res);
                }).catch((res) => console.log(res))
            this.suggestions = '';
            this.contactUsVisible = false;
        },
        coUsCancel() {
            this.suggestion = '';
            this.contactUsVisible = false;
        },

        beforeAvatarUpload(file) {

            const isPic = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isPic) {
                return this.$message.error('上传地点图片只能是 Jpg 或 Png 格式!')
            }
            if (!isLt5M) {
                return this.$message.error('上传地点图片大小不能超过 5MB!')
            }

            let formData = new FormData()
            formData.append('pic', file)
            let that = this;
            // console.log("before axio!");

            var option = ({
                url: 'photo/uploadUserIcon',
                method: 'post',
                data: formData,
                headers: {
                    'token': that.$cookies.get('user_token')
                },
                transformRequest: [function (data, headers) {
                    // console.log(headers)
                    delete headers['Content-Type']
                    return data
                }],
            })
            that.$axios(option).then((res) => {
                this.user.icon = res.data.data
                this.imageUrl = res.data.data
            }).catch((error) => console.log(error));
            this.getIcon();
            /*that.$axios.post('photo/uploadUserIcon',
                {
                    formData
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'token': that.$cookies.get('user_token')
                    },
                }).then((res) => {
                    console.log("res:");
                    console.log(res);
                // console.log(res);
            }).catch((res) => console.log(res))*/
        },

        handleAvatarSuccess(res, file) {
            // console.log(file)
            this.getIcon();
        },

        logOut() {
            let that = this;
            that.$cookies.remove('user_token');
            that.$cookies.remove('user_type');
            this.$router.replace({ path: '/' }).then(() => {
                bus.emit('force-update-tabbar');
            });
        },

    },
    data() {
        return { isReload: true, }
    }
}
</script>

<template>
    <div class="InforPage">
        <el-container class="MainPart">
            <el-header height="20%">
                <div class="headPart">
                    <div v-if="isReload" style="padding-top: 15%;">
                        <div @click="showLeft">
                            <van-row gutter="25">
                            <van-col span="12">
                                <div class="pic-container"><img :src="this.imageUrl"></div>
                            </van-col>
                            <van-col span="10" style="padding-top: 10%">
                                <p style="margin-left: 5%;font-size: 21px;">{{ this.user.name }}</p>
                            </van-col>
                            </van-row>
                        </div>
                        <van-popup 
                            v-model:show="show" 
                            position="left"
                            :style="{ width: '60%', height: '100%' }">
                            <div class="LeftPart" style="padding-left: 5%;">
                                <div v-if="isReload" style="padding-top: 25%; 
                                    height: 40%; width: 40%; ">
                                    <el-tooltip class="item" effect="dark" content="点击更换头像" placement="right">
                                    <div class="pic-container">
                                        <el-upload class="avatar-uploader" action="http://43.143.148.116:8080/photo/uploadUserIcon"
                                            :show-file-list="false" :on-success="handleAvatarSuccess"
                                            :before-upload="beforeAvatarUpload">
                                        <img :src="this.imageUrl">
                                        </el-upload>
                                    </div>
                                    </el-tooltip>
                                    <p style="margin-left: 5%;font-size: 21px;">{{ this.user.name }}</p>
                                </div>
                                <el-row class="firstRow">
                                        <p style="padding-top: 8%; padding-bottom: 5%; font-size:1.2em">{{ user.description }}</p>
                                <el-descriptions column=1>
                                    <el-descriptions-item label="校区:">
                                        <span style="font-size: 14px;">{{ user.campus == '1' ? '学院路校区' : '沙河校区' }}</span>
                                    </el-descriptions-item>
                                    <el-descriptions-item label="年级:">
                                        <span style="font-size: 14px;">{{ user.grade == '1' ? '本科' : user.grade == '2' ? '硕士' :
                                            '博士' }}</span>
                                    </el-descriptions-item>
                                    <el-descriptions-item label="性别:">
                                        <span v-if="user.gender == 0" style="font-size: 14px;">男</span>
                                        <span v-if="user.gender == 1" style="font-size: 14px;">女</span>
                                    </el-descriptions-item>
                                </el-descriptions>
                                </el-row>
                                <el-row class="thirdRow">
                                    <div style="padding-top:70%;"></div>
                                </el-row>
                            </div>
                        </van-popup>
                    </div>
                    <div class="buttonArea">
                        <div style="padding-top: 50%;"></div>
                        <el-button round style="font-size: 15px;" @click="editVisible = true">编辑</el-button>
                        <el-button round>
                            <el-dropdown>
                                <span class="el-dropdown-link" style="font-size: 15px;">
                                    设置
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>
                                            <el-button @click="changePasswordVisible = true">修改密码</el-button>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-button @click="contactUsVisible = true">联系我们</el-button>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-button @click="logOut()">登出</el-button>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-button>
                    </div>
                </div>
                <el-divider />
            </el-header>
            <el-main>
                <div>
                    <p style="font-size: 20px;">我的钉子</p>
                    <MyPin_Mobile></MyPin_Mobile>
                </div>
            </el-main>
        </el-container>
        <!--edit Dialog-->

        <van-dialog v-model:show="editVisible" title="请编辑你的信息" show-cancel-button style="height: 55%;"
            @confirm="editConfirm" @cancel="editCancel">
            <el-form :model="user" label-width="100px" class="form">
                <el-form-item label="用户名">
                    <el-input v-model="tempUser.name" />
                </el-form-item>
                <el-form-item label="校区">
                    <el-select v-model="tempUser.campus" placeholder="请选择校区" class="el-select">
                        <el-option label="学院路校区" value="1"></el-option>
                        <el-option label="沙河校区" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="年级">
                    <el-select v-model="tempUser.grade" placeholder="请选择年级" class="el-select">
                        <el-option label="本科" value="1"></el-option>
                        <el-option label="硕士" value="2"></el-option>
                        <el-option label="博士" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="个人描述">
                    <el-input v-model="tempUser.description" />
                </el-form-item>

                <el-form-item label="性别">
                    <el-radio-group v-model="tempUser.gender">
                        <el-radio :label="0">男</el-radio>
                        <el-radio :label="1">女</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </van-dialog>

        <van-dialog v-model:show="changePasswordVisible" title="修改密码" show-cancel-button style="height: 38%;"
            @confirm="chPaConfirm" @cancel="chPaCancel">
            <el-form :model="user" label-width="120px" class="form">
                <el-form-item label="请输入当前密码">
                    <el-input v-model="curPassword" />
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input v-model="newPassword" />
                </el-form-item>
                <el-form-item label="确认新密码">
                    <el-input v-model="tempPassword" />
                </el-form-item>
            </el-form>
        </van-dialog>
        <!--contactUs Dialog-->
        <van-dialog v-model:show="contactUsVisible" title="联系我们" show-cancel-button style="height: 38%;"
            @confirm="coUsCancel" @cancel="coUsConfirm">
            <div style="padding-left: 8%; padding-top: 8%; padding-right: 10%;">
            <el-input v-model="suggestion" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                placeholder="Please input"/>
            </div>
        </van-dialog>
    </div>
</template>

<style scoped>
.InforPage {
    width: 100%;
    height: 100%;
    padding-right: 2%;
    display: block;
}
.headPart {
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: row;
    /*background-image: url('https://s2.loli.net/2023/04/25/VbTDNRqLr8UMZlB.png');*/
}

.headPart>div {
    flex: 1;
    vertical-align: bottom;
}

.buttonArea {
    margin-left: 15%;
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

.achImg {
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
    width: 30%;
    height: 30%;
    text-align: center;
}

.ml-2 {
    margin-left: 3%;
}

p.desc {
    text-align-last: center;
}

#body {
    margin-top: 5%;
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

.pic-container {
    aspect-ratio: 1/1;
    height: 80%;
    border-radius: 50%;
    /* 设置圆角半径为容器宽高的一半 */
    overflow: hidden;
    /* 超出容器的部分隐藏 */
    margin-top: 5%;
    margin-left: 3%;
    margin-bottom: 3%;
}

.pic-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 图片不拉伸，并保持完整显示 */
}

.el-form-item {
    width: 100%;
    text-align: center;
}
.form {
    padding-top: 8%;
    padding-right: 10%;
}
.dialog-footer {
    padding-left: 20%;
    padding-right: 20%;
    padding-bottom: 5%;
}
</style>