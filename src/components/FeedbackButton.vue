/* eslint-disable */
<template>
  <el-button @click="fk_dialogFormVisible = true">
    123123
  </el-button>
  <el-dialog v-model="fk_dialogFormVisible" title="错误反馈" width="80%">
    <el-form :data="formData" height="250" style="width: 100%">
      <el-form-item label="标题">
        <el-input v-model="formData.title"/>
      </el-form-item>
      <el-form-item label="详细信息">
        <el-input v-model="formData.detail"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="fk_dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="fankui()">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import global from "@/global";

export default {
  name: "FeedbackButton",
  data() {
    return {
      fk_dialogFormVisible: false,
      formData: [],
    }
  },
  methods:
      {
        fankui() {
          let that = this
          that.$axios.post('/map/pin/feedback', {
            id: 0,
            title: that.formData.title,
            position: that.formData.detail,
          }, {
            headers: {
              'token': global.global_token
            }
          })
              .then(response => {
                console.log(response);
                this.dialogVisible = false;
              })
              .catch(error => {
                console.error(error);
              });
        }
      },
}
</script>

<style scoped>

</style>