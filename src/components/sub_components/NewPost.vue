<template>
    <div class="post-add">
        <el-dialog :title="dialogTitle" v-model="dialogVisible">
            <el-form :model="formData" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="formData.post_title" autosize maxlength="60"></el-input>
                </el-form-item>
                <!-- <el-form-item label="正文">
                    <el-input v-model="formData.post_body" type="textarea" :rows="6" maxlength="200"></el-input>
                </el-form-item> -->
                <el-form-item label="正文">
                    <div style="width:100%">
                        <MyEditor @input="updateContent" :sendData="formData.post_body"></MyEditor>
                    </div>
                </el-form-item>
                <el-form-item label="类别">
                    <el-radio-group v-model="formData.pin_type">
                        <el-radio :label="1">餐饮</el-radio>
                        <el-radio :label="2">园地</el-radio>
                        <el-radio :label="3">教学</el-radio>
                        <el-radio :label="4">体育</el-radio>
                        <el-radio :label="5">办公</el-radio>
                        <el-radio :label="6">购物</el-radio>
                        <el-radio :label="7">生活服务</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="关联钉子">
                    <PostBindPin @get_bind_pins="(_bind_pins) => bind_pins = _bind_pins" />
                </el-form-item>
            </el-form>

            <div>
                <el-button @click="dialogVisible = false">取消
                    <CloseOutlined />
                </el-button>
                <el-button type="primary" @click="submitForm">确认
                    <CheckOutlined />
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import PostBindPin from "@/components/sub_components/PostBindPin.vue";
import MyEditor from "@/components/sub_components/QuillEditor.vue";

export default {
    data() {
        return {
            dialogVisible: false, // 对话框可见性
            formData: {
                post_title: "",
                post_body: "",
                pin_type: -1,
            },   // 表单数据
            dialogTitle: '新建帖子',

            bind_pins: []
        }
    },

    components: {
        CheckOutlined,
        CloseOutlined,
        PostBindPin,
        MyEditor
    },

    methods: {
        updateContent(data) {
            console.log(data)
            this.formData.post_body = data;
            console.log('update: ' + this.formData.post_body)
        },

        submitForm() {
            if (this.formData.post_title === '') {
                return this.$message.error("帖子标题不能为空")
            } else if (this.formData.post_body === '') {
                return this.$message.error("帖子正文不能为空")
            } else if (this.formData.pin_type === -1) {
                return this.$message.error("类别不能为空")
            }

            let that = this
            let pins = this.bind_pins.join(';');
            //console.log(pins)

            that.$axios.post('/forum/post/addPost', null, {
                params: {
                    tag: that.formData.pin_type,
                    pinIdStr: pins,
                    title: that.formData.post_title,
                    content: that.formData.post_body,
                },
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((response) => {
                //console.log(response.data)
                that.bind_pins = []
                if (response.data.code == 200) {
                    that.$router.push(`/Forum/${response.data.data}`);
                }
            })
            that.dialogVisible = false
        },
    },

    mounted() {
        this.bind_pins = []
    },
}
</script>


<style scoped></style>

