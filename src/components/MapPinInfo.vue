<template>
    <div class="map-pin-info">
        <el-drawer :title="info.name" direction="ltr" v-model="drawer" :with-header="true">
            <div>
                <el-button type="primary" @click="editInfo">编辑信息</el-button>
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

            <div class="pin-info">
                <el-card :body-style="{ padding: '10px' }">
                    <h4>Info</h4>
                    <p>{{ info.name }}</p>
                    <p>{{ info.position }}</p>
                    <p>{{ info.brief }}</p>
                    <!-- <p> {{ pin_tag }}</p> -->
                    <p>{{ _get_pin_type(info.pin_type) }}</p>
                    <p>{{ info.opening_time }}</p>
                    <p>{{ info.phone }}</p>
                </el-card>
            </div>

            <div class="pin-photo">
                <el-card :body-style="{ padding: '10px' }">
                    <h4>Photos</h4>
                    <el-carousel trigger="click" height="150">
                        <el-carousel-item v-for="photoUrl in photos" :key="photoUrl">
                            <img :src="photoUrl"  class="photo"/>
                        </el-carousel-item>
                    </el-carousel>
                </el-card>
            </div>

            <div class="pin-service">
                <el-card :body-style="{ padding: '10px' }">
                    <h4>Services</h4>
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

            <div class="pin-forum">
                <el-card :body-style="{ padding: '10px' }">
                    <h4>Forum</h4>
                    <p>此处预留跳转链接</p>
                </el-card>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import global from '@/global'

export default {
    props: {
        id: -1
    },
    emits: [
        'close_drawer'
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
            // 信息栏是否展开
            drawer: false,
            // 对话框可见性
            dialogVisible: false,

            formData: {}, // 编辑表单数据
            formTitle: {
                id:"id",
                name: "名称",
                position: "位置描述",
                brief: "简介",
                pin_type: "类别",
                opening_time: "开放时间",
                phone: "电话"
            },

            dialogTitle: '编辑信息'
        }
    },

    methods: {
        _get_pin_type(pin_type_id) {
            return global.get_pin_type(pin_type_id)
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
                console.log(res)
                that.info.name = res.data.data.pin.name
                that.info.position = res.data.data.pin.position
                that.info.brief = res.data.data.pin.brief
                that.info.pin_type = res.data.data.pin.type
                that.info.opening_time = res.data.data.pin.openTime
                that.info.phone = res.data.data.pin.phone

                that.photos = res.data.data.photos
                that.services = res.data.data.services
                that.drawer = true;
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
                    console.log(response);
                    this.dialogVisible = false;
                })
                .catch(error => {
                    console.error(error);
                });
            Object.assign(this.info, this.formData) // 通过 Object.assign 方法更新 info 数据
            this.dialogVisible = false
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
</style>