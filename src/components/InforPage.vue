<script>
import PageHeader from './PageHeader.vue'
import {ref, reactive, onMounted} from 'vue'
import global from "@/global";
import { ElMessage } from 'element-plus'

export default {
  components: {PageHeader},
  setup(){
    // information:
    const user = reactive( {
      id: 0,
      name: "initial",
      email : 'initial' + "@buaa.edu.cn",
      type: 0,
      password: 'initial',
      icon: "../assets/ava.png",
      campus: "initial",
      grade: "initial",
      gender: 0,
      description: "tell you later .",
    });
    const tempUser = reactive( {
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

    return {user, tempUser,
      curPassword, newPassword, tempPassword,
      editVisible, changePasswordVisible, imageUrl };
  },
  mounted() {
    this.initInfor();
  },
  methods: {
    initInfor(){
      let that = this;
      console.log(global.global_token);
      that.$axios.get('user/getUserByToken', {
        headers: {
          'token': global.global_token
        }
      }).then((res) => {
        console.log(res);
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
        console.log(this.user);
        this.refreshTempUser();
      }).catch((res) => console.log(res));
    },
    refreshTempUser(){
      this.tempUser.name = this.user.name;
      this.tempUser.campus = this.user.campus;
      this.tempUser.grade = this.user.grade;
      this.tempUser.gender = this.user.gender;
      this.tempUser.description = this.tempUser.description;
    },
    updateEdit(){
      console.log(this.user);
      console.log(global.global_token);
      let that = this;
      that.$axios.post('user/changeUserBasicByToken' ,
          { name: this.user.name,
            campus: this.user.campus,
            grade: this.user.grade,
            gender: this.user.gender,
            description: this.user.description,},
          { headers: {
              'token': global.global_token
        },
      }).then((res) => {
        console.log(res);
      }).catch((res) => console.log(res))
    },
    editConfirm(){
      console.log("in confirm!");
      this.user.name = this.tempUser.name;
      this.user.campus = this.tempUser.campus;
      this.user.grade = this.tempUser.grade;
      this.user.gender = this.tempUser.gender;
      this.user.description = this.tempUser.description;
      this.editVisible = false;
      this.updateEdit();
    },
    editCancel(){
      console.log("in cancel!");
      this.refreshTempUser();
      this.editVisible = false;
    },

    changePassword(){
      that.$axios.post('user/changePasswordByToken' + global_token,
          {password: this.user.description,},
          { headers: {
          'token': global.global_token
        },
      }).then((res) => {
        console.log(res);
      }).catch((res) => console.log(res))
    },
    chPaConfirm(){
      if(this.curPassword !== this.user.password){
        ElMessage.error('密码错误!')
      }else{
        if(this.newPassword !== this.tempPassword){
          ElMessage.error('两次新密码不一致!')
        }else{
          this.changePassword();
        }
      }
    },
    chPaCancel(){
      this.changePasswordVisible = false;
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        console.log('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        console.log('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;

    },

    handleAvatarSuccess(res, file){
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(file)
    },
  },
  data() {
    return {
    }
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
            <el-avatar size='large' class="avatar" src="../assets/ava.png"/>
          </div>
          <div class="buttonArea">
            <div style="padding-top: 20%"></div>
            <el-button round @click="editVisible = true">Edit</el-button>
            <el-button round>
              <el-dropdown>
              <span class="el-dropdown-link">
                Settings
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item><el-button @click="changePasswordVisible = true">changePassword</el-button></el-dropdown-item>
                    <el-dropdown-item>1</el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item disabled>Action 4</el-dropdown-item>
                    <el-dropdown-item divided>Action 5</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-button>
          </div>
        </div>
        <el-divider />
      </el-header>
      <el-container>
        <el-aside width="30%">
          <div class="LeftPart">
            <el-row class="firstRow">
              <p style="padding-bottom: 5%; font-size:1.5em">{{ user.description }}</p>
              <el-descriptions column = 1>
                <el-descriptions-item label="campus:">{{user.campus}}</el-descriptions-item>
                <el-descriptions-item label="grade:">{{user.grade}}</el-descriptions-item>
              </el-descriptions>
            </el-row>
            <el-row class="secondRow">
              <el-divider content-position="left">Achievements</el-divider>
              <el-scrollbar>
                <div class="scrollbar-flex-content">
                  <p v-for="item in 10" :key="item" class="scrollbar-demo-item">
                    {{ item }}
                  </p>
                </div>
              </el-scrollbar>
            </el-row>
            <el-row class="thirdRow">
              <el-divider content-position="left">Tags</el-divider>
              <el-tag>Tag 1</el-tag>
              <el-tag class="ml-2" type="success">Tag 2</el-tag>
              <el-tag class="ml-2" type="info">Tag 3</el-tag>
              <el-tag class="ml-2" type="warning">Tag 4</el-tag>
              <el-tag class="ml-2" type="danger">Tag 5</el-tag>
            </el-row>
          </div>
        </el-aside>
        <el-main>
          <div>
            <el-upload
                class="avatar-uploader"
                action="http://43.143.148.116:8080/user/uploadIcon"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <!--edit Dialog-->
    <el-dialog
        v-model="editVisible"
        title="EditInformation"
        width="50%"
    >
      <el-form :model="user" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="tempUser.name" />
        </el-form-item>
        <el-form-item label="Campus">
          <el-input v-model="tempUser.campus" />
        </el-form-item>
        <el-form-item label="Grade">
          <el-input v-model="tempUser.grade" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="tempUser.description" />
        </el-form-item>
        <el-form-item label="Gender">
          <el-radio-group v-model="tempUser.gender">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel">Cancel</el-button>
          <el-button type="primary" @click="editConfirm">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!--changePassword Dialog-->
    <el-dialog
        v-model="changePasswordVisible"
        title="Change Password"
        width="30%"
    >
      <el-form :model="user" label-width="120px">
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
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="chPaCancel">Cancel</el-button>
          <el-button type="primary" @click="chPaConfirm">
            Confirm
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
.header{
  height: 7%;
  display: block;
}
.headPart {
  width: 100%;
  display: flex;
  padding-top: 3%;
  flex-direction: row;
  margin-right: 2%;
}
.headPart > div {
  flex: 1;
  vertical-align: bottom;
}
.buttonArea{
  margin-left: 30%;
}
.MainPart{
  height: 100%;
  width: 100%;
  position: fixed;
}
.LeftPart{
  margin-left: 8%;
  border-right-width: thin;
  border-right-style: double;
  border-right-color: gainsboro;
}
.avatar{
  margin-top: 10%;
  margin-bottom: 2%;
  margin-left: 5%;
}
.firstRow{
  margin-bottom: 10%;
  display: block;
  align-items: center;
}
.secondRow{
  margin-right: 8%;
  margin-bottom: 10%;
}
.thirdRow{
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
.ml-2{
  margin-left: 3%;
}
p.desc{
  text-align-last: center;
}

#body{
  margin-top: 10%;
  height: 20px;
  width: 20px;
}
.ul{
  margin-top: 10%;
}
.left{
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 2%;
  margin-right: 20%;
}
.right{
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 20%;
  margin-right: 2%;
}
.li{
  border: 0;
  font-family: inherit;
  font-size: 100%;
  font-weight: 400;
  font-style: normal;
  line-height: 1.55;
  display: list-item;
  text-align: -webkit-match-parent;
}
span{
  font-size: 120%;
}
a{
  font-size: 120%;
  font-weight: 550;
}
</style>