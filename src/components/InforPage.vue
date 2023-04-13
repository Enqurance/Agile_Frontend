<script>
import {ref, reactive} from 'vue'
export default {
  setup(){
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
    const editVisible = ref(false);
    async function editConfirm(){
      console.log("in confirm");
      this.user.name = this.tempUser.name;
      this.user.email = this.tempUser.email;
      this.user.campus = this.tempUser.campus;
      this.user.grade = this.tempUser.grade;
      this.user.gender = this.tempUser.gender;
      this.user.description = this.tempUser.description;
      this.editVisible = false;
    }
    async function editCancel(){
      console.log("in cancel!");
      this.tempUser.name = this.user.name;
      this.tempUser.email = this.user.email;
      this.tempUser.campus = this.user.campus;
      this.tempUser.grade = this.user.grade;
      this.tempUser.gender = this.user.gender;
      this.tempUser.description = this.user.description;
      this.editVisible = false;
    }
    return {user, tempUser, editVisible, 
      editConfirm, editCancel};
  },
  method: {
  },
  data() {
    return {
    }
  }
}
</script>

<template>
  <div class="InforPage">
    <el-container class="MainPart">
      <el-header height="30%">
        <div class="headPart">
          <div>
            <el-avatar size='large' class="avatar" src="../assets/ava.png"/>
          </div>
          <div class="buttonArea">
            <div style="padding-top: 20%"></div>
            <el-button round @click="editVisible = true">Edit</el-button>
            <el-button round>Setting</el-button>
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
          Main
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
    v-model="editVisible"
    title="EditInformation"
    width="50%"
    >
      <el-form :model="user" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="tempUser.name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="tempUser.email" />
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
          <el-button @click="editCancel()">Cancel</el-button>
          <el-button type="primary" @click="editConfirm()">
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
}
.headPart {
  width: 100%;
  display: flex;
  padding-top: 3%;
  flex-direction: row;
  margin-right: 2%;
  background: url("../assets/back.png");
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
  align-content: left;
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
.ml-2{
  margin-left: 3%;
}
p.desc{
  text-align-last: center;
}
</style>