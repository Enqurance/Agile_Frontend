<template>
    <div class="map-pin-add">
        <van-dialog :title="dialogTitle" v-model:show="dialogVisible"
                    style="width: 80%; padding: 3% 0; background: #fafafa"
                    :show-cancel-button="true" @confirm="submitForm">
            <van-form :model="formData" style="padding-top: 5%; padding-bottom: 5%">
                <van-cell-group inset>
                    <van-field v-model="formData.name" name="名称" label="名称" maxlength="20"
                               :rules="[{required: true, message: '请填写名称'}]"/>
                    <van-field v-model="formData.brief" name="简介" label="简介"
                               type="textarea" autosize maxlength="100"
                               :rules="[{required: true, message: '请填写简介'}]"/>
                    <van-field name="类别" label="类别">
                        <template #input>
                            <van-radio-group v-model="formData.pin_type" direction="horizontal"
                                             :rules="[{valid_type, message: '请填写类型'}]">
                                <van-radio style="margin-bottom: 4px" :name="1">餐饮</van-radio>
                                <van-radio style="margin-bottom: 4px" :name="2">园地</van-radio>
                                <van-radio style="margin-bottom: 4px" :name="3">教学</van-radio>
                                <van-radio style="margin-bottom: 4px" :name="4">体育</van-radio>
                                <van-radio style="margin-bottom: 4px" :name="5">办公</van-radio>
                                <van-radio style="margin-bottom: 4px" :name="6">购物</van-radio>
                                <van-radio style="margin-bottom: 4px" :name="7">生活服务</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-field v-model="formData.position" name="位置描述" label="位置描述" maxlength="100"
                               type="textarea"/>
                    <van-field v-model="formData.opening_time" name="开放时间" label="开放时间" maxlength="100"
                               type="textarea"/>
                    <van-field v-model="formData.phone" name="电话" label="电话" maxlength="20"/>
                </van-cell-group>
            </van-form>
        </van-dialog>
    </div>
</template>

<script>
import {ref} from "vue";

export default {
    props: {
        lnglat: Array,
        is_add_pin: Boolean
    },
    emits: [
        'addMarker',
        'close_dialog'
    ],
    setup() {
        const contentRef = ref(null)

        const valid_type = (val) => {
            return val >= 1 && val <= 7
        }
        return {
            valid_type,
            contentRef
        }
    },
    data() {
        return {
            dialogVisible: false, // 对话框可见性
            formData: {},   // 表单数据
            dialogTitle: '新增地点'
        }
    },

    methods: {
        addPin() {
            this.formData = {
                id: 0,
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
            if (this.formData.name === '') {
                return this.$message.error("名称不能为空")
            }
            else if (this.formData.brief === '') {
                return this.$message.error("简介不能为空")
            }
            else if (this.formData.pin_type === -1) {
                return this.$message.error("类别不能为空")
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



