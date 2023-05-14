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
                    :options="options"
                    placeholder="请选择Tag"
                    @change="handle_change">
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
    },
    components: {
        CheckOutlined,
        CloseOutlined,
    },
    emits: [
        'switch_pin',
        'close_dialog'
    ],
    data() {
        return {
            dialogVisible: false,
            dialogTitle: "移动钉子",
            value: [],
            options: [
            {
                value: "yuandi",
                label: "园地"
            }, {
                value: "jiaoxue",
                label: "教学"
            }, {
                value: "tiyu",
                label: "体育"
            }, {
                value: "bangong",
                label: "办公"
            }, {
                value: "gouwu",
                label: "购物"
            }, {
                value: "shenghuofuwu",
                label: "生活服务"
            }]
        };
    },
    methods: {
        open_dialog() {
            this.dialogVisible = true
        },
        switch_pin() {
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

                for (let marker_info in that.markers_info) {
                    let info = Object.assign({}, {
                        id: marker_info
                    }, that.markers_info[marker_info])
                    this.add_marker(info)
                }
                this.init_menu()
                    // console.log(that.markers)
                }).catch((res) => {
                    console.log(res)
                })
        },
        handle_change() {

        },
        submit() {

        }
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