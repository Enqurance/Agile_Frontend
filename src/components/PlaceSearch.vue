<template>
    <div v-if="is_display" style="height: 100%">
        <el-row style="margin-bottom: 0.5%">
            <el-col :span="24">
                <el-input v-model="search_content" placeholder="请输入查找信息" clearable maxlength="24"
                          @blur="open_sel=false" @click="search_for_content()" @input="search_for_content()"
                          @keyup.enter="sub_p_id(show_p_id)">
                    <template #append>
                        <el-button data-testid="search-button" style="color: #42b983" class="iconfont icon-sousuo"
                                   @click="sub_p_id(show_p_id)"/>
                    </template>
                </el-input>
            </el-col>
        </el-row>

        <div v-if="open_sel && search_result_num > 5" class="result_div" style="height: 50%">
            <el-scrollbar>
                <div v-for="item in search_result" :key="item.id" style="margin: 0.5% 0.5%; padding: 2% 0"
                     :class="{result_mouseover: mouseover_p_id === item.id}"
                     @mouseenter="mouseover_p_id = item.id" @mouseleave="mouseover_p_id = -1"
                     @click="change_show_id(item.id)">
                    <div style="float: left; margin-left: 4%">
                        <span class="iconfont icon-sousuo"> </span>
                    </div>

                    <div style="float: left; margin-left: 5%;" class="max_length">
                        <span>{{ item.name }}</span>
                    </div>

                    <div style="float: left; margin-left: 5%">
                        <span style="color: cornflowerblue">{{ _get_pin_type(item.type) }}</span>
                    </div>
                    <div style="clear: both"></div>
                </div>
            </el-scrollbar>
        </div>
        <div v-else-if="open_sel && search_result_num > 0 && search_result_num <= 5" class="result_div">
            <div v-for="item in search_result" :key="item.id" style="margin: 0.5% 0.5%; padding: 2% 0"
                 :class="{result_mouseover: mouseover_p_id === item.id}"
                 @mouseenter="mouseover_p_id = item.id" @mouseleave="mouseover_p_id = -1"
                 @click="change_show_id(item.id)">
                <div style="float: left; margin-left: 4%">
                    <span class="iconfont icon-sousuo"> </span>
                </div>

                <div style="float: left; margin-left: 5%;" class="max_length">
                    <span>{{ item.name }}</span>
                </div>

                <div style="float: left; margin-left: 5%">
                    <span style="color: cornflowerblue">{{ _get_pin_type(item.type) }}</span>
                </div>
                <div style="clear: both"></div>
            </div>
        </div>
        <div v-else-if="open_sel" class="result_div">
            <el-row>
                <el-col :span="24" style="text-align: center">
                    <span>无相关地点</span>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
import '../assets/PlaceSearch/font1/iconfont.css'
import global from '@/global'
import {ElMessage} from "element-plus";

export default {
    name: "PlaceSearch",
    emits: ['submit_p_id'],
    data() {
        return {
            is_display: true,

            open_sel: false,

            search_content: "",
            search_result: [
                {
                    id: null,
                    name: null,
                    type: null
                },
            ],

            mouseover_p_id: -1,
            show_p_id: -1,

        }
    },
    computed: {
        search_result_num() {
            if (this.search_result instanceof Array) {
                return this.search_result.length
            }
            else {
                return 0
            }
        },
    },
    methods: {
        search_for_content() {
            if (this.search_content === "") {
                this.show_p_id = -1
                this.open_sel = false
                return
            }

            let that = this
            that.$axios.post('map/pin_search', {
                search_content: that.search_content,
            }, {
                headers: {
                    'token': global.global_token
                }
            }).then((res) => {
                that.search_result = res.data.data.search_result_list
                that.show_p_ip = res.data.data.max_suit_p_id
                that.open_sel = true
            }).catch((res) => console.log(res))
        },
        sub_p_id(p_id) {
            if (this.show_p_id === -1) {
                ElMessage({
                    message: "无相关地点",
                    showClose: true,
                    center: true,
                    duration: 1000
                })
            }
            else {
                this.open_sel = false
                this.$emit('submit_p_id', p_id)
            }
        },
        change_show_id(p_id) {
            this.show_p_id = p_id
            this.sub_p_id(p_id)
        },
        _get_pin_type(pin_type_id) {
            return global.get_pin_type(pin_type_id)
        }
    },
    watch: {
        search_content(newData, oldData) {
            if (newData !== oldData) {
                console.log("search_content: " + newData)
            }
        },
        show_p_id(newData, oldData) {
            if (newData !== oldData) {
                console.log("show_p_id: " + newData)
            }
        },
    }
}
</script>

<style scoped>

.result_div {
    border: 2px solid #f0f0f0;
    border-radius: 3px;
}

.max_length {
    width: 50%;
    overflow: hidden; /*内容会被修剪，并且其余内容是不可见的*/
    text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本。*/
    white-space: nowrap; /*文本不换行*/
}

.result_mouseover {
    background: rgb(230, 230, 230);
    cursor: pointer;
}

</style>