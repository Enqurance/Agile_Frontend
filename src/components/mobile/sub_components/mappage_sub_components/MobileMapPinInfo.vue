<template>
    <div>
        <van-dialog v-model:show="drawer" :z-index="1000" style="height: 80%; overflow-y: auto; padding: 3% 0"
                    :scrollable="true" confirm-button-text="关闭" id="pinInfo"
                    @confirm="() => {drawer=false; this.$emit('close_drawer')}">
            <div style="margin-top: 0;margin-bottom: 0;">
                <h1 style="margin-left: 10px;margin-top: 0;padding: 0">{{ info.name }}</h1>
            </div>

            <div class="pin-info">
                <el-card :body-style="{ padding: '10px' }">
                    <div
                        style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0;">
                        <h4 style="margin-bottom: 0;">信息</h4>
                        <el-button
                            v-if="(info.visibility === 0 || this.$cookies.get('user_type') === get_user_type_administrator()) && is_examine===false && pin_state===0"
                            @touchend="editInfo">
                            <EditOutlined/>
                        </el-button>
                    </div>

                    <!-- <p>{{ info.name }}</p> -->
                    <p v-if="info.position">位置描述：{{ info.position }}</p>
                    <p v-if="info.brief">简介：{{ info.brief }}</p>
                    <!-- <p> {{ pin_tag }}</p> -->
                    <p v-if="_get_pin_type(info.pin_type)">类型：{{ _get_pin_type(info.pin_type) }}</p>
                    <p v-if="info.opening_time">开放时间：{{ info.opening_time }}</p>
                    <p v-if="info.phone">电话：{{ info.phone }}</p>
                </el-card>
            </div>

            <div class="pin-photo">
                <el-card :body-style="{ padding: '10px' }">
                    <h4>图片</h4>
                    <el-carousel trigger="click" height="150">
                        <el-carousel-item v-for="photoUrl in photos" :key="photoUrl">
                            <img :src="photoUrl" class="photo" @contextmenu.prevent="deletePhoto(photoUrl)"/>
                        </el-carousel-item>
                    </el-carousel>

                    <el-upload
                        v-if="(info.visibility === 0 || this.$cookies.get('user_type') === get_user_type_administrator()) && is_examine===false && pin_state===0"
                        class="avatar-uploader" action="https://buaamapforum.cn:8443/photo/uploadPinPhoto"
                        :show-file-list="false" :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <el-button size="small" type="primary" plain>上传图片</el-button>
                    </el-upload>
                </el-card>
            </div>

            <div v-if="services && services.length" class="pin-service">
                <el-card :body-style="{ padding: '10px' }">
                    <h4>服务</h4>
                    <el-collapse>
                        <el-collapse-item v-for="(service, index) in services" :key="index" :title="service.name">
                            <el-card :body-style="{ padding: '10px' }">
                                <div class="detail">
                                    <div class="name">{{ service.name }}</div>
                                    <div class="info">{{ service.brief }}</div>
                                </div>
                                <img :src="service.photo" class="photo"/>
                            </el-card>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </div>

            <!-- <div class="pin-forum">
                <el-card :body-style="{ padding: '10px' }">
                    <h4>Forum</h4>
                    <p>此处预留跳转链接</p>
                </el-card>
            </div> -->
            <div style="text-align: center">
                <div style="width: 98%; display: inline-block">
                    <van-button v-if="info.visibility===0 && this.$cookies.get('user_type')==='0'"
                                size="large" :style="{background: _get_pin_color_state(pin_state)}"
                                @touchend="open_public">
                        {{ _get_pin_state(pin_state) }}
                    </van-button>
                    <van-button v-if="info.visibility===1 && this.$cookies.get('user_type')==='0'"
                                size="large" :style="{background: _get_pin_color_state(pin_state)}"
                                @touchend="open_feedback">
                        {{ _get_public_pin_state(pin_state) }}
                    </van-button>
                </div>
            </div>

        </van-dialog>

        <van-dialog v-model:show="show_feedback" :z-index="2000" style="background: #fcfcfc; padding: 3% 0"
                    :show-cancel-button="true" @confirm="apply_feedback" title="反馈公共钉">
            <van-form :model="feedback" style="margin: 20px 0">
                <van-cell-group inset>
                    <van-field v-model="feedback.title" name="名称" label="标题" maxlength="10"
                               :rules="[{required: true, message: '请填写标题'}]"/>
                    <van-field v-model="feedback.reason" name="简介" label="内容" maxlength="100" type="textarea"
                               :rules="[{required: true, message: '请填写内容'}]"/>
                </van-cell-group>
            </van-form>
        </van-dialog>

        <van-dialog v-model:show="show_apply" :z-index="2000" style="background: #fcfcfc; padding: 3% 0"
                    :show-cancel-button="true" @confirm="apply_public">
            <div style="margin: 20px 0; text-align: center">
                <h3>是否确定申请为公共钉？</h3>
            </div>
        </van-dialog>

        <van-dialog :title="dialogTitle" style="width: 80%; padding: 3% 0; background: #fafafa"
                    :z-index="2000"
                    v-model:show="dialogVisible" :showCancelButton="true" @confirm="submitForm"
        >
            <van-form :model="formData" style="padding-top: 5%; padding-bottom: 5%">
                <van-cell-group inset>
                    <van-field v-model="formData.name" name="名称" label="名称" maxlength="20"
                               :rules="[{required: true, message: '请填写名称'}]"/>
                    <van-field v-model="formData.brief" name="简介" label="简介" maxlength="100" type="textarea"
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
import global from '@/global'
import {EditOutlined} from '@ant-design/icons-vue';
import {ElMessageBox, ElMessage} from "element-plus";
import {ref} from 'vue'

export default {
    props: {
        id: Number,
        is_examine: Boolean
    },
    emits: [
        'close_drawer',
        'update_info'
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
            // 存储地图钉信息
            info: {
                name: "新北食堂",
                position: "北边",
                brief: "这里是新北食堂的简介",
                pin_type: 1,
                opening_time: "24h",
                phone: "133-3333-3333",
                visibility: 1,
            },
            photos: [
                "https://s2.loli.net/2023/04/10/LAMxqJCK1aOQeHb.jpg",
                "https://s2.loli.net/2023/04/10/lGHxgJm93OB1fKq.jpg"
            ],
            services: [
                {
                    name: "羊肉",
                    brief: "这是关于羊肉食品的简介",
                    photo: "https://s2.loli.net/2023/04/10/RMqIaFuidyXotWf.jpg",
                },
                {
                    name: "羊肉2",
                    brief: "这是关于羊肉2食品的简介",
                    photo: "https://s2.loli.net/2023/04/10/RMqIaFuidyXotWf.jpg",
                }
            ],
            pin_state: 0,
            show_apply: false,
            show_feedback: false,
            feedback: {
                title: '',
                reason: ''
            },

            // 信息栏是否展开
            drawer: false,
            // 对话框可见性
            dialogVisible: false,

            formData: {}, // 编辑表单数据

            dialogTitle: '编辑信息'
        }
    },
    components: {
        EditOutlined,
    },
    methods: {
        _get_pin_type(pin_type_id) {
            return global.get_pin_type(pin_type_id)
        },
        _get_pin_state(pin_state_id) {
            return global.get_pin_state(pin_state_id)
        },
        _get_public_pin_state(pin_state_id) {
            return global.get_public_pin_state(pin_state_id)
        },
        _get_pin_color_state(pin_state_id) {
            return global.get_pin_state_color(pin_state_id)
        },
        get_user_type_administrator() {
            return global.user_type_administrator
        },
        handleDblClick() {
            this.getPinInfoById();
        },
        // 获取地图钉信息
        getPinInfoById() {
            let that = this
            that.$axios.post('map/pin/getPinInfoById', {
                id: that.id,
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res)
                that.info.name = res.data.data.pin.name
                that.info.position = res.data.data.pin.position
                that.info.brief = res.data.data.pin.brief
                that.info.pin_type = res.data.data.pin.type
                that.info.opening_time = res.data.data.pin.openTime
                that.info.phone = res.data.data.pin.phone
                that.info.visibility = res.data.data.pin.visibility

                that.photos = res.data.data.photos
                that.services = res.data.data.services
                that.drawer = true;

                that.$axios.get('/examine/' + (res.data.data.pin.visibility === 0 ? 'get_pin_state/' : 'get_public_pin_state/') + that.id, {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    }
                }).then((res) => {
                    // console.log(res)
                    document.getElementById('pinInfo').scrollTo(0, 0)
                    that.pin_state = res.data.data
                }).catch((error) => {
                    console.log(error)
                })
            }).catch((res) => console.log(res))
        },

        // 编辑请求
        editInfo() {
            // 进入编辑模式并打开对话框
            // 修改鉴权交给上一层
            this.formData = Object.assign({}, this.info)
            this.drawer = false
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
            let now_id = that.id
            that.$axios.post('/map/pin/changePinInfoById', {
                id: now_id,
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
                .then(() => {
                    that.$emit('update_info', {
                        id: now_id,
                        name: that.formData.name,
                        type: that.formData.pin_type,
                    })
                })
                .catch(error => {
                    console.error(error);
                });
            Object.assign(this.info, this.formData) // 通过 Object.assign 方法更新 info 数据
            this.dialogVisible = false
        },

        beforeAvatarUpload(file) {
            // console.log("in beforeAvatarUpload!");
            const isPic = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isPic) {
                return this.$message.error('上传地点图片只能是 Jpg 或 Png 格式!')
            }
            if (!isLt5M) {
                return this.$message.error('上传地点图片大小不能超过 5MB!')
            }

            let that = this;
            let formData = new FormData()
            formData.append('pin_id', that.id)
            formData.append('pic', file)

            // console.log("before axio!");

            var option = ({
                url: 'photo/uploadPinPhoto',
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

            // console.log(that.photos.length)
            that.$axios(option).then((res) => {
                this.handleDblClick()
            }).catch((error) => console.log(error));

        },

        handleAvatarSuccess(res, file) {
            // console.log(file)
        },

        deletePhoto(photoUrl) {
            let that = this;
            if (!that.$cookies.get('user_token')) {
                that.$message({
                    message: '请先登录!',
                    type: "warning"
                })
                that.$router.push({path: '/login'})
                return
            }
            const index = that.photos.indexOf(photoUrl);
            // console.log("url " + photoUrl)
            // console.log("index " + index)

            if (that.info.visibility === 1 && that.$cookies.get('user_type') === "0") {
                return this.$message.error("系统点图片不可删除")
            }
            else {
                ElMessageBox.confirm(
                    '确认删除该图片？',
                    'Warning',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).then(() => {
                    that.$axios.post('/photo/deletePinPhoto', {
                        pin_id: that.id,
                        url: photoUrl
                    }, {
                        headers: {
                            'token': that.$cookies.get('user_token')
                        }
                    }).then((res) => {
                        this.handleDblClick()
                    }).catch((res) => console.log(res))
                }).catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '取消删除',
                    })
                })
            }
        },

        open_public() {
            if (this.pin_state === 1) {
                this.$message({
                    type: 'warning',
                    message: '已申请，管理员将尽快审批！',
                    showClose: true,
                    grouping: true
                })
            }
            else {
                this.show_apply = true
            }
        },

        apply_public() {
            let that = this

            that.$axios.get('/examine/apply_for_public/' + that.id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then(() => {
                that.pin_state = 1
                that.$message({
                    type: 'success',
                    message: '申请成功，管理员将尽快审批！',
                    showClose: true
                })
            }).catch((error) => {
                console.log(error)
                that.$message({
                    type: 'error',
                    message: '申请失败！！',
                    showClose: true
                })
            })

        },

        open_feedback() {
            if (this.pin_state === 1) {
                this.$message({
                    type: 'warning',
                    message: '已申请，管理员将尽快审批！',
                    showClose: true,
                    grouping: true
                })
            }
            else {
                this.show_feedback = true
                this.feedback.title = ''
                this.feedback.reason = ''
            }
        },

        apply_feedback() {
            if (this.feedback.reason === '' || this.feedback.title === '') {
                this.$message({
                    type: 'warning',
                    grouping: true,
                    showClose: true,
                    message: '请输入理由'
                })
                return;
            }

            let that = this

            that.$axios.post('/examine/apply_for_feedback/' + that.id, {
                'title': that.feedback.title,
                'content': that.feedback.reason
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then(() => {
                // console.log(res)
                that.show_feedback = false
                that.pin_state = 1
                that.$message({
                    type: 'success',
                    message: '反馈成功，管理员将尽快审批！',
                    showClose: true
                })
            }).catch((error) => {
                console.log(error)
                that.$message({
                    type: 'error',
                    message: '反馈失败！！',
                    showClose: true
                })
            })
        }
    },
    watch: {
        id(newData, oldData) {
            if (newData !== oldData && newData !== -1) {
                this.handleDblClick()
            }
        },
        dialogVisible(newData) {
            if (newData === false) {
                this.$emit("close_drawer")
                // console.log("submit: close_drawer")
            }
        },
    }
}
</script>


<style scoped>
.pin-info {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f5f7fa;
}

.pin-photo,
.pin-service,
.pin-forum {
    padding: 10px;
}


.service-item .photo {
    margin-right: 20px;
}

.photo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

p {
    margin-left: 10px;
}

.float_right {
    float: right;
}

h1 {
    text-align: center; /* 将文本居中 */
    display: flex; /* 将元素转换为弹性布局 */
    justify-content: center; /* 水平居中 */
}

</style>