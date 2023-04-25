<script>
import PageHeader from './PageHeader.vue'
import {ref, reactive} from 'vue'

export default {
    components: {PageHeader},
    inject:['reload'],
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
        };
    },
    mounted() {
        this.initInfor();
    },
    methods: {
        getIcon(){
            let that = this;
            that.$axios.get('user/getIcon',
                {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    },
                }).then((res) => {
                 //console.log(res);
                 this.user.icon = res.data.data ;
                 this.imageUrl = res.data.data;
                 //console.log(this.user.icon);
            }).catch((res) => console.log(res))

            this.refreshIcon();
        },
        refreshIcon(){
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

            console.log("reload");
            this.$router.go(0);
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
                        that.$router.push({path: '/login'})
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

        coUsConfirm(){         
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
                 console.log(res);
            }).catch((res) => console.log(res))
            this.suggestions = '';
            this.contactUsVisible = false;
        },
        coUsCancel(){
            this.suggestion = '';
            this.contactUsVisible = false;
        },

        beforeAvatarUpload(file) {
            
            const isPic = file.type === 'image/jpeg'|| file.type === 'image/png';
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
                headers:{
                    'token': that.$cookies.get('user_token')
                },
                transformRequest: [function(data, headers){
                    console.log(headers)
                    delete headers['Content-Type']
                    return data
                }],
            })
            that.$axios(option).then((res)=>(console.log(res)));
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

        logOut(){
            let that = this;
            that.$cookies.remove('user_token');
            that.$cookies.remove('user_type');
            this.$router.replace({path: '/'});
        },

    },
    data() {
        return {isReload: true,}
    }
}
</script>

<template>
    <div class="InforPage">
        <div class="header">
            <PageHeader style="position: fixed; top: 0; width: 100%; z-index: 3; background: black; opacity: 0.3"/>
        </div>
        <el-container class="MainPart">
            <el-header height="35%">
                <div class="headPart">
                    <div v-if="isReload">
                        <el-tooltip class="item" effect="dark" content="点击更换头像" placement="right">
                            <div class="pic-container">
                                <el-upload
                                    class="avatar-uploader"
                                    action="http://43.143.148.116:8080/photo/uploadUserIcon"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                        <img :src="this.imageUrl">
                                </el-upload>
                            </div>
                        </el-tooltip>
                        <!-- <p style = "text-align: center;">点击更换头像</p> -->
                        <span style="margin-left: 5%;font-size: 30px;">{{this.user.name}}</span>
                    </div>
                    <div class="buttonArea">
                        <div style="padding-top: 40%"></div>
                        <el-button round style="font-size: 20px;" @click="editVisible = true">编辑</el-button>
                        <el-button round>
                            <el-dropdown>
                        <span class="el-dropdown-link" style="font-size: 20px;">
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
                <el-divider/>
            </el-header>
            <el-container>
                <el-aside width="30%" >
                    <div class="LeftPart">
                        <el-row class="firstRow">
                            <p style="padding-bottom: 5%; font-size:1em">{{ user.description }}</p>
                            <el-descriptions column=1>
                                <el-descriptions-item label="校区:">
                                    <span style="font-size: 14px;">{{ user.campus == '1' ? '学院路校区' : '沙河校区' }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item label="年级:">
                                    <span style="font-size: 14px;">{{ user.grade == '1' ? '本科' : user.grade == '2' ? '硕士' : '博士' }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item label="性别:">
                                    <span v-if="user.gender == 0"  style="font-size: 14px;">男</span>
                                    <span v-if="user.gender == 1"  style="font-size: 14px;">女</span>    
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-row>
                        <!--
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
                        -->
                        <el-row class="thirdRow">
                            <el-divider content-position="left">标签</el-divider>
                            <el-tag
                                v-for="tag in tags"
                                :key="tag.name"
                                class="mx-1"
                                closable
                                :type="tag.type"
                                style = "margin-right: 8px"
                            >
                                {{ tag.name }}
                            </el-tag>
                        </el-row>
                    </div>
                </el-aside>
                <el-main>
                    <div>
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
            <el-form :model="user" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="tempUser.name"/>
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
        <!--contactUs Dialog-->
        <el-dialog
                v-model="contactUsVisible"
                title="联系我们"
                width="30%"
        >
        <el-input
            v-model="suggestion"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
        />
            <template #footer>
        <span class="dialog-footer">
          <el-button @click="coUsCancel">取消</el-button>
          <el-button type="primary" @click="coUsConfirm">
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
    padding-right: 2%;
    display: block;
}

.header {
    height: 8%;
    display: block;
}

.headPart {
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: row;
    background-image: url('https://s2.loli.net/2023/04/25/VbTDNRqLr8UMZlB.png');
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
    margin-top: 25%;
    margin-bottom: 2%;
    margin-left: 5%;
    width: 20%;
}
.avatarUp {
    margin-top: 10%;
    margin-bottom: 2%;
    margin-left: 5%;
    width: 20%;
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
    height: 40%;
    border-radius: 50%; /* 设置圆角半径为容器宽高的一半 */
    overflow: hidden; /* 超出容器的部分隐藏 */
    margin-top: 15%;
    margin-left:3%;
    margin-bottom:3% ;
}

.pic-container img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 图片不拉伸，并保持完整显示 */
}

.el-form-item {
    width: 100%;
    text-align: center;
}
</style>