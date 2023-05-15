<template>
    <div class="map-pin-info">
        <el-drawer direction="ltr" v-model="drawer"
                   :with-header="true" :append-to-body="true" class="my-drawer">
            <div style="margin-top: 0px;margin-bottom: 0px;">
                <el-button v-if="info.visibility===0 && this.$cookies.get('user_type')==='0'" class="float_right"
                           size="large" :style="{background: _get_pin_color_state(pin_state)}" @click="apply_public">
                    {{ _get_pin_state(pin_state) }}
                </el-button>
                <el-button v-if="info.visibility===1 && this.$cookies.get('user_type')==='0'" class="float_right"
                           size="large" :style="{background: _get_pin_color_state(pin_state)}" @click="() => {
                    if (this.pin_state === 1) {
                this.$message({
                    type: 'warning',
                    message: '已申请，管理员将尽快审批！',
                    showClose: true,
                    grouping: true
                })
                return
            }
            else {
                    show_feedback=true; this.feedback.title=''
                    this.feedback.reason=''
                    }
                }">{{ _get_public_pin_state(pin_state) }}
                </el-button>

                <el-dialog v-model="show_feedback" style="height: 250px;width: 40%">
                    <el-form>
                        <el-form-item label="标题：">
                            <el-input type="text" maxlength="10" v-model="feedback.title" autocomplete="off"/>
                        </el-form-item>
                        <el-form-item label="内容：">
                            <el-input type="textarea" clearable rows="3" v-model="feedback.reason" autocomplete="off"/>
                        </el-form-item>
                    </el-form>
                    <div style="position: absolute;bottom: 10px; right: 20px">
                        <el-button @click="show_feedback = false">取消</el-button>
                        <el-button type="primary" @click="apply_feedback">确定</el-button>
                    </div>
                </el-dialog>

                <h1 style="margin-left: 10px;margin-top: 0px;padding: 0px">{{ info.name }}</h1>
            </div>

            <div>
                <el-dialog :title="dialogTitle" v-model="dialogVisible">
                    <el-form :model="formData" label-width="100px">
                        <el-form-item label="名称">
                            <el-input v-model="formData.name" maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="简介">
                            <el-input v-model="formData.brief"
                                      type="textarea" autosize maxlength="100"></el-input>
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
                        <el-form-item label="位置描述">
                            <el-input v-model="formData.position"
                                      type="textarea" autosize maxlength="100"></el-input>
                        </el-form-item>
                        <el-form-item label="开放时间">
                            <el-input v-model="formData.opening_time"
                                      type="textarea" autosize maxlength="100"></el-input>
                        </el-form-item>
                        <el-form-item label="电话">
                            <el-input v-model="formData.phone"></el-input>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-button @click="dialogVisible = false">取消
                            <CloseOutlined/>
                        </el-button>
                        <el-button type="primary" @click="submitForm">确认
                            <CheckOutlined/>
                        </el-button>
                    </div>
                </el-dialog>
            </div>

            <div class="pin-info">
                <el-card :body-style="{ padding: '10px' }">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0px;">
                        <h4 style="margin-bottom: 0px;">信息</h4>
                        <el-button type="link"
                                   v-if="(info.visibility === 0 || this.$cookies.get('user_type') === '1') && is_examine===false && pin_state===0"
                                   @click="editInfo">
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
                            v-if="(info.visibility === 0 || this.$cookies.get('user_type') === '1') && is_examine===false && pin_state===0"
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
        </el-drawer>
    </div>
</template>

<script>
import global from '@/global'
import {EditOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons-vue';
import {ElMessageBox, ElMessage} from "element-plus";

export default {
    props: {
        id: Number,
        is_examine: Boolean
    },
    emits: [
        'close_drawer',
        'update_info'
    ],
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
        CheckOutlined,
        CloseOutlined,
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
                // console.log(that.id)
                that.$axios.get('/examine/' + (res.data.data.pin.visibility === 0 ? 'get_pin_state/' : 'get_public_pin_state/') + that.id, {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    }
                }).then((res) => {
                    // console.log(res)
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
            that.$axios.post('/map/pin/changePinInfoById', {
                id: that.id,
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
                    // console.log(response);
                    that.$emit('update_info', {
                        id: that.id,
                        name: that.formData.name,
                        type: that.formData.pin_type,
                    })
                    this.dialogVisible = false;
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

        apply_public() {
            if (this.pin_state === 1) {
                this.$message({
                    type: 'warning',
                    message: '已申请，管理员将尽快审批！',
                    showClose: true,
                    grouping: true
                })
                return
            }
            else {
                let that = this

                ElMessageBox.confirm(
                    '确认申请为公共钉？',
                    'Warning',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).then(() => {
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
                }).catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '取消删除',
                        grouping: true,
                        showClose: true
                    })
                })
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

            ElMessageBox.confirm(
                '确认反馈内容？',
                'Warning',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
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
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消删除',
                    grouping: true,
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
        drawer(newData) {
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

.service-item {
    display: flex;
    align-items: center;
}

.service-item .photo {
    margin-right: 20px;
}

.el-divider {
    margin: 10px 0;
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

.avatar {
    margin-top: 10%;
    margin-bottom: 2%;
    margin-left: 5%;
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

</style>