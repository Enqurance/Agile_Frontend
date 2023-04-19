<template>
    <div class="map-pin-add">
        <el-dialog :title="dialogTitle" v-model="dialogVisible">
            <el-form :model="formData" label-width="100px">
                <el-form-item label="名称">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="位置描述">
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
        lnglat: Array,
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
            formTitle: {
                id:"id",
                name: "名称",
                position: "位置描述",
                brief: "简介",
                pin_type: "类别",
                opening_time: "开放时间",
                phone: "电话"
            },
            dialogTitle: '新增地点'
        }
    },

    methods: {
        addPin() {
            this.formData = {
                id:0,
                name: "",
                position: "",
                brief: "",
                pin_type: -1,
                opening_time: "",
                phone: ""
            }
            this.dialogVisible = true
        },

        // 提交修改
        submitForm() {
            for (var i in this.formData) {
                if (this.formTitle[i] === "类别") {
                    if (this.formData[i] === -1) {
                        return this.$message.error(this.formTitle[i] + "不能为空")
                    }
                } else if (this.formTitle[i] === "id") {
                    continue
                } else if (this.formData[i].trim().length == 0) {
                    return this.$message.error(this.formTitle[i] + "不能为空")
                }
            }

            let that = this
            const lnglatString = that.lnglat.join(';');

            that.$axios.post('/map/pin/addPinByCoords', {
                lnglat: lnglatString,
                name: that.formData.name,
                position: that.formData.position,
                brief: that.formData.brief,
                type: that.formData.pin_type,
                openTime: that.formData.opening_time,
                phone: that.formData.phone
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            })
                .then(response => {
                    this.dialogVisible = false;
                    const click_marker_info = {
                        id: response.data.data,
                        name: that.formData.name,
                        type: that.formData.pin_type,
                        visibility: true
                    }
                    this.$emit('addMarker', click_marker_info)
                })
                .catch(error => {
                    console.error(error);
                });
            this.dialogVisible = false
        },
    },
    watch: {
        is_add_pin(newData) {
            if (newData === true) {
                this.addPin()
            }
        },
        dialogVisible(newData, oldData) {
            if (newData !== oldData && newData === false) {
                this.$emit('close_dialog')
            }
        }
    }
}
</script>


<style scoped>
</style>



