<template>
    <div style="height: 100%" >
        <el-row style="padding-bottom: 0.5%" >
            <el-col :span="24">
                <el-input v-model="search_content" placeholder="请输入查找信息" maxlength="24"
                          @click="search_for_content()" @input="search_for_content()"
                          @keyup.enter="sub_p_id(show_p_id)" >
                    <template #append>
                        <el-button data-testid="search-button" style="color: #42b983" class="iconfont icon-sousuo"
                                   @click="sub_p_id(show_p_id)"/>
                    </template>
                </el-input>
            </el-col>
        </el-row>
        <div >
            <div v-if="open_sel && search_result_num > 5" class="result_div">
                <el-scrollbar style="height: 150px">
                    <div v-for="item in search_result" :key="item.id"
                         style="padding: 2% 0"
                         :class="{result_mouseover: mouseover_p_id === item.id}"
                         @mouseenter="mouseover_p_id = item.id" @mouseleave="mouseover_p_id = -1"
                         @click="change_show_id(item.id)">
                        <div style="float: left; padding-left: 4%">
                            <span class="iconfont icon-sousuo"> </span>
                        </div>

                        <div style="float: left; padding-left: 5%;" class="max_length">
                            <span>{{ item.name }}</span>
                        </div>

                        <div style="float: left; padding-left: 5%">
                            <span style="color: cornflowerblue">{{ _get_pin_type(item.type) }}</span>
                        </div>
                        <div style="clear: both"></div>
                    </div>
                </el-scrollbar>
                <div style="height: 10px"></div>
            </div>
            <div v-else-if="open_sel && search_result_num > 0 && search_result_num <= 5" class="result_div">
                <div v-for="item in search_result" :key="item.id"
                     style="padding: 2% 0"
                     :class="{result_mouseover: mouseover_p_id === item.id}"
                     @mouseenter="mouseover_p_id = item.id" @mouseleave="mouseover_p_id = -1"
                     @click="change_show_id(item.id)">
                    <div style="float: left; padding-left: 4%">
                        <span class="iconfont icon-sousuo"> </span>
                    </div>

                    <div style="float: left; padding-left: 5%;" class="max_length">
                        <span>{{ item.name }}</span>
                    </div>

                    <div style="float: left; padding-left: 5%">
                        <span style="color: cornflowerblue">{{ _get_pin_type(item.type) }}</span>
                    </div>
                    <div style="clear: both"></div>
                </div>
                <div style="height: 10px"></div>
            </div>
            <div v-else-if="open_sel" class="result_div">
                <el-row>
                    <el-col :span="24" style="text-align: center">
                        <span>无相关地点</span>
                    </el-col>
                </el-row>
                <div style="height: 10px"></div>
            </div>
        </div>
    </div >
</template>

<script>
import '../../assets/PlaceSearch/font1/iconfont.css'
import global from '@/global'
import {ElMessage} from "element-plus";

export default {
    name: "PlaceSearch",
    props: ['click_map'],
    emits: ['submit_p_id', 'search_close'],
    data() {
        return {
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

            search_lock: false

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
            this.show_p_id = -1
            this.open_sel = false
            this.mouseover_p_id = -1
            if (this.search_content === "") {
                return
            }

            let that = this
            this.search_lock = true
            that.$axios.post('map/pin_search', {
                searchContext: that.search_content,
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res)
                that.search_result = res.data.data.search_result_list
                that.show_p_id = res.data.data.max_suit_p_id
                that.open_sel = true
                that.search_lock = false
                if (this.search_content === "") {
                    that.open_sel = false
                }
            }).catch((res) => {
                console.log(res)
                that.open_sel = false
            })
        },
        sub_p_id(p_id) {
            if (this.show_p_id === -1) {
                ElMessage({
                    message: "无相关地点",
                    showClose: true,
                    grouping: true,
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
            // console.log("show_p_id: " + p_id)
            this.show_p_id = p_id
            this.mouseover_p_id = -1
            this.sub_p_id(p_id)
        },
        _get_pin_type(pin_type_id) {
            return global.get_pin_type(pin_type_id)
        }
    },
    watch: {
        search_content(newData, oldData) {
            if (newData !== oldData) {
                // console.log("search_content: " + newData)
            }
        },
        show_p_id(newData, oldData) {
            if (newData !== oldData) {
                // console.log("show_p_id: " + newData)
            }
        },
        click_map(newData, oldData) {
            if (newData !== oldData && newData === true) {
                this.open_sel = false
                this.$emit('search_close')
            }
        },
    }
}
</script>

<style scoped>

.result_div {
    /*border: 2px solid #f0f0f0;*/
    border-radius: 0 0 10px 10px;
    background: white;
}

.max_length {
    width: 50%;
    overflow: hidden; /*内容会被修剪，并且其余内容是不可见的*/
    text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本。*/
    white-space: nowrap; /*文本不换行*/
}

.result_mouseover {
    background: #f0f0f0;
    cursor: pointer;
}

</style>