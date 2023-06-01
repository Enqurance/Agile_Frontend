<template>
    <div class="post-add">
        <van-dialog v-model:show="dialogVisible" :z-index="2000" style="padding: 3% 0;"
                    :show-cancel-button="true" title="新建帖子" @confirm="submitForm">
            <van-form :model="formData" style="margin: 20px 0">
                <van-cell-group inset>
                    <van-field v-model="formData.post_title" name="名称" label="标题" type="textarea" autosize
                               maxlength="60" :rules="[{ required: true, message: '请填写帖子标题' }]" />
                    <van-cell title="正文" value="" />
                    <div>
                        <MyEditor @input="updateContent" :initialValue="formData.content" :sendData="formData.content">
                        </MyEditor>
                    </div>
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
                    <van-cell title="关联钉子" value="" />
                    <PostBindPin @get_bind_pins="(_bind_pins) => bind_pins = _bind_pins" />
                </van-cell-group>
            </van-form>
        </van-dialog>
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
        PostBindPin,
        MyEditor
    },

    setup() {
        const valid_type = (val) => {
            return val >= 1 && val <= 7
        }
        return {
            valid_type
        }
    },

    methods: {
        updateContent(data) {
            this.formData.post_body = data;
        },

        submitForm() {
            console.log(this.formData)
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

            that.$axios.post('/forum/post/addPost', {
                tag: that.formData.pin_type,
                pinIdStr: pins,
                title: that.formData.post_title,
                content: that.formData.post_body,
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((response) => {
                //console.log(response.data)
                that.bind_pins = []
                if (response.data.code === 200) {
                    that.$router.push(`/Forum/${response.data.data}`);
                    that.dialogVisible = false
                }
                else {
                    this.$message({
                        message: response.data,
                        type: 'error',
                        showClose: true,
                    })
                }
            }).catch((error) => console.log(error))
        },
    },

    mounted() {
        this.bind_pins = []
    },
}
</script>


<style scoped></style>

