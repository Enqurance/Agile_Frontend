<template>
    <div>
        <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="400">
        <!-- <el-row>
            <el-col :span="3" class="my_col"></el-col>
            <el-col :span="6" class="my_col">选择Pin</el-col>
        </el-row> -->
        <el-row>
            <el-col :span="3" class="my-col"></el-col>
            <el-col :span="18" class="my-col">
                <div>
                <el-cascader
                    v-model="value"
                    ref="cascader"
                    :options="options"
                    placeholder="请选择Tag"
                    :show-all-levels="false">
                </el-cascader>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3" class="my-col"></el-col>
            <el-col :span="18" class="my-col">
            <div>
                <el-button @click="dialogVisible = false">取消  <CloseOutlined /></el-button>
                <el-button type="primary" @click="submit">确认  <CheckOutlined /></el-button> 
            </div>
            </el-col>
        </el-row>
        </el-dialog>       
    </div>
</template>

<script>
import { CheckOutlined, CloseOutlined} from '@ant-design/icons-vue';

export default {
    props: {
        is_switch: Boolean,
        lnglat: Array,
    },
    components: {
        CheckOutlined,
        CloseOutlined,
    },
    emits: [
        'close_dialog',
        'get_value',
        'switch_pos'
    ],
    data() {
        return {
            dialogVisible: false,
            dialogTitle: "移动钉子",
            selectedValues: [],
            value: [],
            formData: {},
            options: [
            {
                value: "canyi",
                label: "餐饮",
                children: [

                ]
            }, 
            {
                value: "yuandi",
                label: "园地",
                children: [

                ]
            }, {
                value: "jiaoxue",
                label: "教学",
                children: [

                ]
            }, {
                value: "tiyu",
                label: "体育",
                children: [

                ]
            }, {
                value: "bangong",
                label: "办公",
                children: [

                ]
            }, {
                value: "gouwu",
                label: "购物",
                children: [

                ]
            }, {
                value: "shenghuofuwu",
                label: "生活服务",
                children: [

                ]
            }]
        };
    },
    methods: {
        open_dialog() {
            this.dialogVisible = true
            this.get_pin()
        },
        get_pin() {
            let that = this
            that.dialogVisible = true
            this.markers_info = {}
            that.$axios.get('map/getUserAllBriefPin', {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                that.markers_info = {}
                for (let pin of res.data.data) {
                    that.markers_info[pin["id"]] = {
                    'name': pin["name"],
                    'type': pin["type"],
                    'visibility': pin["visibility"],
                    'lnglat': pin["lnglat"]
                    }
                }
                let pins = []
                for (let marker_info in that.markers_info) {
                    let info = Object.assign({}, {
                        id: marker_info
                    }, that.markers_info[marker_info])
                    pins.push(info)
                }
                for(let seq in pins) {
                    let pin = pins[seq]
                    this.options[pin.type - 1].children.push({
                        value: pin.id, 
                        label: pin.name
                        })
                }
                // console.log(that.markers)
            }).catch((res) => {
                console.log(res)
            })
        },
        submit() {
            let that = this
            if (this.$refs.cascader.getCheckedNodes().length === 0) {
                return this.$message.error("请选择一个Pin")
            }
            const pinId = this.$refs.cascader.getCheckedNodes()[0].value
            const lnglatString = that.lnglat.join(';')

            that.$axios.post('/map/switchPos', {
                id: pinId,
                lnglat: lnglatString,
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then(response => {
                    this.dialogVisible = false;
                    const marker_info = {
                        response: response.data.data,
                        id: pinId,
                        lnglat: lnglatString,
                        visibility: true
                    }
                    this.$emit('switch_pos', marker_info)
            }).catch(error => {
                    console.error(error);
            });
            this.dialogVisible = false
        },
    },
    watch: {
        is_switch(newData) {
            if (newData === true) {
                this.open_dialog()
            }
        },
        dialogVisible(newData, oldData) {
            if (newData !== oldData && newData === false) {
                this.$emit("close_dialog")
            }
        }
    }
};
</script>

<style>
    .el-row {
        margin-bottom: 20px;
    }
    .my-col {
        border-radius: 4px;
    }
    .el-cascader {
        width: 100%;
    }
</style>