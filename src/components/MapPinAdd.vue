<template>
  <div class="map-pin-add">
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="formData.position"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="formData.brief"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-radio-group v-model="formData.pin_type">
            <el-radio :label="1">教室</el-radio>
            <el-radio :label="2">食堂</el-radio>
            <el-radio :label="3">宿舍</el-radio>
            <el-radio :label="4">办公</el-radio>
            <el-radio :label="5">运动</el-radio>
            <el-radio :label="6">超市</el-radio>
            <el-radio :label="7">学习</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开放时间">
          <el-input v-model="formData.opening_time"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-dialog>
  </div> 
</template>

<script>
export default {
    props: {
        lnglat: [],
        is_add_pin: Boolean
    },
    emits: [
        'addMarker',
        'close_dialog'
    ],
  
  data() {
    return {
      dialogVisible: false, // 对话框可见性
      formData: {},   // 表单数据
      dialogTitle:'新增地点'
    }
  },

  methods: {
    addPin() {
      this.formData = {}
      this.dialogVisible = true
    },

    // 提交修改
    submitForm() {
      let that = this
      const payload = {
        lnglat: that.lnglat,
        name: that.formData.name,
        position: that.formData.position,
        brief: that.formData.brief,
        type: that.formData.pin_type,
        openTime: that.formData.opening_time,
        phone: that.formData.phone 
      };
      console.log('新增地点的基本信息：', payload);

        that.$axios.post('/map/pin/addPinById', payload)
            .then(response => {
                console.log(response);
                this.dialogVisible = false;

                const click_marker_info = {
                    id: response.data.id,
                    name: that.formData.name,
                    type: that.formData.pin_type,
                    visibility: true
                }
                console.log('组件通信', click_marker_info);
                this.$emit('addMarker', click_marker_info)
            })
            .catch(error => {
                console.error(error);
            });
      this.dialogVisible = false
    },
      closeDialog() {
          this.dialogVisible = false;
          const click_marker_info = {
              id: -1,
              name: this.formData.name,
              type: this.formData.pin_type,
              visibility: true
          }
          console.log('组件通信', click_marker_info);
          this.$emit('addMarker', click_marker_info)
      }
  }
}
</script>


<style scoped>
</style>



