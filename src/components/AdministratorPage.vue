<script>
import {defineComponent} from 'vue'
import PCPageHeader from "@/components/pc/PCPageHeader.vue";
import {Document, Location, Menu as IconMenu,} from "@element-plus/icons-vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {shallowRef} from "@vue/reactivity";
import global from "@/global";
import MapPinInfo from "@/components/pc/sub_components/mappage_sub_components/MapPinInfo.vue";
import CopyrightICP from "@/components/CopyrightICP.vue";

export default defineComponent({
    name: "AdministratorPage",
    components: {
        MapPinInfo,
        Document,
        Location,
        IconMenu,
        PCPageHeader,
        CopyrightICP
    },
    data() {
        let map = shallowRef(null)

        return {
            examine_list: ['审核钉子申请 | 反馈', '审核帖子整改', '审核举报信息'],
            report_list: ['帖子', '回复'],

            show_info: 1,

            map,
            beihang_center: [
                116.347313,
                39.9815
            ],
            beihang_zoom: [
                16,
                20
            ],
            markers_info: Object,
            markers: Object,
            show_marker_id: -1,
            examine_1_1_dialog_show: false,
            now_examine: true,
            pin_apply_public_result: {
                id: -1,
                result: 'false',
                info: ''
            },

            feedback_list: [
                {
                    feedback_id: null,
                    title: null,
                    feedback: null
                }
            ],
            feedback_id_list: [],
            examine_1_2_dialog_show: false,
            pin_feedback_result: {
                pin_id: null,
                feedback_id_list: [],
                info: ''
            },


            rectify_posts: [
                {
                    id: -1,
                    old_title: 'old_title',
                    old_content: 'old_content',
                    basis: '整改建议',
                    new_title: 'new_title',
                    new_content: 'new_content'
                }
            ],
            rectify_post_result: {
                id: -1,
                result: '',
                basis: '并未有不符情况'
            },
            examine_2_dialog_show: false,


            report_posts: [
                {
                    id: -1,
                    title: "title",
                    content: "content",
                    reasons: [
                        "reason1",
                        "reason2"
                    ]
                }
            ],
            report_post_result: {
                id: -1,
                result: '',
                basis: '并未有不符情况'
            },
            examine_3_1_dialog_show: false,

            report_replies: [
                {
                    id: -1,
                    content: "content",
                    type: 0,    // 0 -> floor, 1 -> comment
                    layer: 20,
                    floor_id: 1,
                    post_id: -1,
                    reasons: [
                        "reason1",
                        "reason2"
                    ]
                }
            ],
            report_reply_result: {
                id: -1,
                type: 0,
                result: false,
                basis: '并未有不符情况'
            },
            examine_3_2_dialog_show: false,
        }
    },
    mounted() {
        document.oncontextmenu = () => {
            return false
        }

        this.init_map()
    },
    methods: {
        init_map() {
            let that = this

            function add_marker(info) {
                // eslint-disable-next-line no-undef
                let marker_content = '<div style=\"color:' + that._get_pin_color(info.type) + '\"><span class="iconfont icon-location-full icon_class" ></span></div>'
                let marker = new AMap.Marker({
                    map: that.map,
                    position: info.lnglat,
                    anchor: 'bottom-center',
                    content: marker_content,
                    extData: {
                        id: info.id,
                    }
                })
                that.markers[info.id] = marker

                marker.setLabel({
                    // eslint-disable-next-line no-undef
                    offset: new AMap.Pixel(0, -5),
                    content: info.name,
                    direction: 'top-center',
                })

                that.markers_info[info.id] = {
                    name: info.name,
                    type: info.type,
                    lnglat: info.lnglat,
                    visibility: info.visibility
                }

                marker.on('click', function (e) {
                    that.now_examine = that.markers_info[parseInt(e.target._opts.extData.id)].visibility === 0
                    that.show_marker_id = parseInt(e.target._opts.extData.id)
                })

                marker.on('rightclick', function (e) {
                    that.feedback_id_list = []
                    that.pin_feedback_result.info = ''
                    that.pin_apply_public_result.result = 'false'
                    that.pin_apply_public_result.info = ''

                    that.pin_apply_public_result.id = e.target._opts.extData.id
                    that.pin_feedback_result.id = e.target._opts.extData.id
                    // console.log(that.markers_info[parseInt(e.target._opts.extData.id)].visibility)
                    that.markers_info[parseInt(e.target._opts.extData.id)].visibility === 0 ? that.examine_1_1_dialog_show = true : that.get_pin_feedback_list()
                })

                marker.setMap(that.map)
            }

            that.show_info = 1
            AMapLoader.load({
                key: '159f00b0e9d69324ced6b97a73f6883b',
                version: '2.0',
                plugins: ['AMap.DistrictSearch', 'AMap.Polyline', 'AMap.Marker', 'AMap.Pixel', 'AMap.Icon', ' AMap.Size']
            }).then((AMap) => {
                let that = this

                that.map = new AMap.Map('container', {
                    viewMode: '3D',
                    zoom: 16,
                    center: that.beihang_center,
                    // layers: [
                    //     // 卫星
                    //     new AMap.TileLayer.Satellite(),
                    //     // 路网
                    //     new AMap.TileLayer.RoadNet()
                    // ],
                    features: ['bg', 'road', 'building']
                })
                that.map.setZooms(that.beihang_zoom)

                // let bounds = that.map.getBounds();
                // that.map.setLimitBounds(bounds);

                that.markers_info = {}
                that.$axios.get('examine/get_pin', {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    }
                }).then((res) => {
                    // console.log(res.data)
                    that.markers_info = {}
                    for (let pin of res.data.data) {
                        that.markers_info[pin["id"]] = {
                            'name': pin["name"],
                            'type': pin["type"],
                            'lnglat': pin["lnglat"],
                            'visibility': pin["visibility"]
                        }
                    }
                    for (let marker_info in that.markers_info) {
                        let info = Object.assign({}, {
                            id: marker_info
                        }, that.markers_info[marker_info])
                        // console.log(marker_info)
                        add_marker(info)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }).catch(e => {
                that.$message({
                    type: 'error',
                    message: '获取pin失败！！',
                    showClose: true
                })
                console.log(e)
            })
        },
        _get_pin_color(pin_type_id) {
            return global.get_pin_color(pin_type_id)
        },
        examine_pin_submit() {
            if (this.pin_apply_public_result.result === 'false' && this.pin_apply_public_result.info.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请说明拒绝原因！',
                    showClose: true,
                    grouping: true
                })
                return
            }

            let that = this
            that.$axios.post('examine/result_of_pin/' + that.pin_apply_public_result.id, {
                result: JSON.parse(that.pin_apply_public_result.result),
                info: that.pin_apply_public_result.info
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(that.pin_apply_public_result)
                that.examine_1_1_dialog_show = false

                delete that.markers_info[that.pin_apply_public_result.id]
                Reflect.deleteProperty(that.markers_info, that.pin_apply_public_result.id)
                let marker = that.markers[that.pin_apply_public_result.id]
                marker.setMap(null)
                marker = null

                that.pin_apply_public_result = {
                    id: -1,
                    result: 'false',
                    info: ''
                }
                if (res.data.code !== 200) {
                    that.$message({
                        type: 'error',
                        message: res.data.message,
                        showClose: true
                    })
                }
                else {
                    that.$message({
                        type: 'success',
                        message: '举报帖子审核结果成功提交后端！',
                        showClose: true
                    })
                }
            }).catch((error) => {
                that.$message({
                    type: 'error',
                    message: '提交后端失败！！',
                    showClose: true
                })
                console.log(error)
            })
        },

        get_pin_feedback_list() {
            let that = this
            // console.log(that.pin_feedback_result.id)
            that.$axios.get('examine/get_feedback/' + that.pin_feedback_result.id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                that.feedback_list = res.data.data
                that.examine_1_2_dialog_show = true
            }).catch((error) => {
                console.log(error)
            })
        },
        examine_pin_feedback_submit() {
            this.pin_feedback_result.feedback_id_list = this.feedback_id_list
            if (this.pin_feedback_result.info === '' || this.pin_feedback_result.feedback_id_list === []) {
                this.$message({
                    type: 'warning',
                    message: '请说明拒绝反馈与原因！',
                    showClose: true,
                    grouping: true
                })
                return
            }

            let that = this
            // console.log(that.pin_feedback_result.feedback_id_list)
            that.$axios.post('examine/result_of_feedback/' + that.pin_feedback_result.id, {
                feedback_id_list: that.pin_feedback_result.feedback_id_list,
                info: that.pin_feedback_result.info
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res)
                that.examine_1_2_dialog_show = false

                that.feedback_list = that.feedback_list.filter(item => !that.feedback_id_list.includes(item.feedback_id))

                if (that.feedback_list.length === 0) {
                    delete that.markers_info[that.pin_feedback_result.id]
                    Reflect.deleteProperty(that.markers_info, that.pin_feedback_result.id)
                    let marker = that.markers[that.pin_feedback_result.id]
                    marker.setMap(null)
                    marker = null
                }

                if (res.data.code !== 200) {
                    that.$message({
                        type: 'error',
                        message: res.data.message,
                        showClose: true
                    })
                }
                else {
                    that.$message({
                        type: 'success',
                        message: '举报帖子审核结果成功提交后端！',
                        showClose: true
                    })
                }
            }).catch((error) => {
                that.$message({
                    type: 'error',
                    message: '提交后端失败！！',
                    showClose: true
                })
                console.log(error)
            })
        },


        init_rectify() {
            let that = this
            that.$axios.get('examine/rectify/get_posts', {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                that.rectify_posts = res.data.data
                if (res.data.code === 401) {
                    that.rectify_posts = []
                }

                that.show_info = 2
            }).catch((error) => {
                console.log(error)
            })
        },
        show_dialog_2(id) {
            this.rectify_post_result.id = id
            this.rectify_post_result.result = ''
            this.rectify_post_result.basis = ''
            this.examine_2_dialog_show = true
        },
        examine_post_rectify_submit() {
            if (this.rectify_post_result.result === '' || ((
                this.rectify_post_result.result === '1' || this.rectify_post_result.result === '2') && this.rectify_post_result.basis.length === 0)) {
                this.$message({
                    type: 'warning',
                    message: '请说明原因！',
                    showClose: true,
                    grouping: true
                })
                return
            }

            let that = this
            that.$axios.post('examine/rectify/result_of_rectify_post/' + that.rectify_post_result.id, {
                result: parseInt(that.rectify_post_result.result),
                basis: that.rectify_post_result.basis
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                that.rectify_posts = that.rectify_posts.filter(post => post.id !== that.rectify_post_result.id)
                that.examine_2_dialog_show = false

                if (res.data.code !== 200) {
                    that.$message({
                        type: 'error',
                        message: res.data.message,
                        showClose: true
                    })
                }
                else {
                    that.$message({
                        type: 'success',
                        message: '举报帖子审核结果成功提交后端！',
                        showClose: true
                    })
                }
            }).catch((error) => {
                that.$message({
                    type: 'error',
                    message: '提交后端失败！！',
                    showClose: true
                })
                console.log(error)
            })
        },


        init_report() {
            let that = this

            function init_report_posts() {
                that.$axios.get('examine/report/get_posts', {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    }
                }).then((res) => {
                    // console.log(res)
                    that.report_posts = res.data.data
                    if (res.data.code === 401) {
                        that.report_posts = []
                    }

                    that.show_info = 3
                }).catch((error) => {
                    console.log(error)
                })
            }

            function init_report_replies() {
                that.$axios.get('examine/report/get_replies', {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    }
                }).then((res) => {
                    // console.log(res)
                    that.report_replies = res.data.data
                    if (res.data.code === 401) {
                        that.report_replies = []
                    }

                    that.show_info = 4
                }).catch((error) => {
                    console.log(error)
                })
            }

            return {
                init_report_posts,
                init_report_replies
            }
        },

        show_dialog_3_1(id) {
            this.report_post_result.id = id
            this.report_post_result.result = ''
            this.report_post_result.basis = ''
            this.examine_3_1_dialog_show = true
        },
        examine_post_report_submit() {
            if (this.report_post_result.result === '' || ((
                this.report_post_result.result === '1' || this.report_post_result.result === '2') && this.report_post_result.basis.length === 0)) {
                this.$message({
                    type: 'warning',
                    message: '请说明原因！',
                    showClose: true,
                    grouping: true
                })
                return
            }

            let that = this
            that.$axios.post('examine/report/result_of_report_post/' + that.report_post_result.id, {
                result: parseInt(that.report_post_result.result),
                basis: that.report_post_result.basis
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                that.report_posts = that.report_posts.filter(post => post.id !== that.report_post_result.id)
                that.examine_3_1_dialog_show = false

                if (res.data.code !== 200) {
                    that.$message({
                        type: 'error',
                        message: res.data.message,
                        showClose: true
                    })
                }
                else {
                    that.$message({
                        type: 'success',
                        message: '举报帖子审核结果成功提交后端！',
                        showClose: true
                    })
                }
            }).catch((error) => {
                that.$message({
                    type: 'error',
                    message: '提交后端失败！！',
                    showClose: true
                })
                console.log(error)
            })
        },
        browsePost(id) {
            this.$router.push({path: '/Forum/' + id})
        },

        show_dialog_3_2(id, type) {
            this.report_reply_result.id = id
            this.report_reply_result.type = type
            this.report_reply_result.result = 'false'
            this.report_reply_result.basis = ''
            this.examine_3_2_dialog_show = true
        },
        examine_reply_report_submit() {
            if (this.report_reply_result.result === 'true' && this.report_reply_result.basis.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请说明原因！',
                    showClose: true,
                    grouping: true
                })
                return
            }

            let that = this
            that.$axios.post('examine/report/result_of_report_reply/' + that.report_reply_result.type + '/' + that.report_reply_result.id, {
                result: JSON.parse(that.report_reply_result.result),
                basis: that.report_reply_result.basis
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                that.report_replies = that.report_replies.filter(reply => reply.id !== that.report_reply_result.id || reply.type !== that.report_reply_result.type)
                that.examine_3_2_dialog_show = false

                if (res.data.code !== 200) {
                    that.$message({
                        type: 'error',
                        message: res.data.message,
                        showClose: true
                    })
                }
                else {
                    that.$message({
                        type: 'success',
                        message: '举报帖子审核结果成功提交后端！',
                        showClose: true
                    })
                }
            }).catch((error) => {
                that.$message({
                    type: 'error',
                    message: '提交后端失败！！',
                    showClose: true
                })
                console.log(error)
            })
        },
        browseReply(id, floor_id) {
            this.$router.push({path: '/Forum/' + id, query: {'floor_id': floor_id}})
        },

    },
    watch: {
        feedback_id_list(newData) {
            // console.log(newData)
        },
        feedback_list(newData) {
            // console.log(newData)
        }
    }

})
</script>

<template>
    <div style="height: 100%">
        <el-container style="height: 100%">
            <el-header style="padding-left: 0;padding-right: 0">
                <PCPageHeader/>
            </el-header>
            <el-container style="height: 80%">
                <el-aside style="width: 20%">
                    <el-menu 
                        :default-openeds="['3']" 
                        style="height: 100%" 
                        default-active="1">
                        <el-menu-item index="1" @click="this.init_map">
                            <el-icon>
                                <location/>
                            </el-icon>
                            <template #title>{{ examine_list[0] }}</template>
                        </el-menu-item>
                        <el-menu-item index="2" @click="this.init_rectify">
                            <el-icon>
                                <document/>
                            </el-icon>
                            <template #title>{{ examine_list[1] }}</template>
                        </el-menu-item>
                        <el-sub-menu index="3">
                            <template #title>
                                <el-icon>
                                    <IconMenu/>
                                </el-icon>
                                <span>{{ examine_list[2] }}</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="3-1" @click="this.init_report().init_report_posts()">{{ report_list[0] }}</el-menu-item>
                                <el-menu-item index="3-2" @click="this.init_report().init_report_replies()">{{ report_list[1] }}</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main style="height: 100%">
                    <div v-if="show_info===1" style="height: 100%">
                        <div id="container" style="width: 100%; height: 100%"></div>
                        <el-dialog v-model="examine_1_1_dialog_show" :show-close="true" title="公共pin申请">
                            <el-form :model="pin_apply_public_result" label-width="120px">
                                <el-form-item label="申请结果">
                                    <el-radio-group v-model="pin_apply_public_result.result">
                                        <el-radio label="true">同意</el-radio>
                                        <el-radio label="false">拒绝</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="理由">
                                    <!--                                    <el-radio-group v-model="pin_apply_public_result.result">-->
                                    <!--                                        <el-radio label="pin较为小众">pin较为小众</el-radio>-->
                                    <!--                                        <el-radio label="内容违反法律">内容违反法律</el-radio>-->
                                    <!--                                        <el-radio label="内容违反法律"><el-input v-model="pin_apply_public_result.info" type="textarea" maxlength="100" ></el-input></el-radio>-->
                                    <!--                                    </el-radio-group>-->
                                    <el-input v-model="pin_apply_public_result.info" type="textarea"
                                              maxlength="100"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="examine_pin_submit">确定</el-button>
                                    <el-button @click="examine_1_1_dialog_show=false">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                        <el-dialog v-model="examine_1_2_dialog_show" :show-close="true" title="公共pin反馈">
                            <el-form :model="pin_feedback_result" label-width="120px">
                                <el-form-item label="全部反馈">
                                    <el-select v-model="feedback_id_list" multiple placeholder="请选择审核反馈">
                                        <el-popover v-for="item in feedback_list" :key="item.feedback_id"
                                                    :content="item.feedback" placement="right" width="20%">
                                            <template #reference>
                                                <el-option :label="item.title" :value="item.feedback_id"
                                                           :key="item.feedback_id"/>
                                            </template>
                                        </el-popover>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="处理结果">
                                    <el-input v-model="pin_feedback_result.info" type="textarea"
                                              maxlength="100"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="examine_pin_feedback_submit">确定</el-button>
                                    <el-button @click="() => {examine_1_2_dialog_show=false}">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                    </div>
                    <div v-else-if="show_info===2">
                        <div v-if="rectify_posts.length === 0">
                            <el-empty description="没有需要审核整改的贴子"/>
                        </div>
                        <div v-for="post in rectify_posts" :key="post.id" style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 98%; margin-bottom: 20px" @click.right="show_dialog_2(post.id)">
                            <div style="padding: 10px 0">
                                <el-row :gutter="30" style="margin: 0 0; padding-bottom: 20px">
                                    <el-col :span="12">
                                        <h3 style="margin: 0 0">整改后</h3>
                                    </el-col>
                                    <el-col :span="12">
                                        <h3 style="margin: 0 0">整改前</h3>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="30" style="margin: 0 0">
                                    <el-col :span="12">
                                        <h4 style="margin: 0 0">标题</h4>
                                    </el-col>
                                    <el-col :span="12">
                                        <h4 style="margin: 0 0">标题</h4>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="30" style="margin: 0 0; padding-bottom: 15px">
                                    <el-col :span="12">
                                        <el-text tag="i">{{ post.new_title }}</el-text>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-text tag="i">{{ post.old_title }}</el-text>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="30" style="margin: 0 0">
                                    <el-col :span="12">
                                        <h4 style="margin: 0 0">内容</h4>
                                    </el-col>
                                    <el-col :span="12">
                                        <h4 style="margin: 0 0">内容</h4>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="30" style="margin: 0 0; padding-bottom: 20px">
                                    <el-col :span="12">
                                        <el-text tag="i">{{ post.new_content }}</el-text>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-text tag="i">{{ post.old_content }}</el-text>
                                    </el-col>
                                </el-row>
                                <el-row style="margin: 0 0; padding-left: 15px">
                                    <el-col :span="24">
                                        <el-text tag="b">整改建议：</el-text>
                                        <el-text tag="i">{{ post.basis }}</el-text>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <el-dialog v-model="examine_2_dialog_show" :show-close="true" title="帖子整改">
                            <el-form :model="rectify_post_result" label-width="120px">
                                <el-form-item label="整改结果">
                                    <el-radio-group v-model="rectify_post_result.result">
                                        <el-radio label="0">整改成功</el-radio>
                                        <el-radio label="1">整改失败、重新整改</el-radio>
                                        <el-radio label="2">整改失败、直接删除</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item v-if="rectify_post_result.result==='1'||rectify_post_result.result==='2'"
                                              label="整改建议">
                                    <el-input v-model="rectify_post_result.basis" type="textarea"
                                              maxlength="100"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="examine_post_rectify_submit">确定</el-button>
                                    <el-button @click="examine_2_dialog_show=false">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                    </div>
                    <div v-else-if="show_info===3">
                        <div v-if="report_posts.length === 0">
                            <el-empty description="没有被举报的贴子"/>
                        </div>
                        <div v-for="post in report_posts" :key="post.id"
                             style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 98%; margin-bottom: 20px"
                             @click.right="show_dialog_3_1(post.id)">
                            <el-popconfirm title="确定跳转到帖子？" :hide-icon=true :hide-after=0 width="200"
                                           confirm-button-text="确定" cancel-button-text="取消"
                                           @confirm="browsePost(post.id)">
                                <template #reference>
                                    <h3 class="link_hover"
                                        style="padding: 0 20px; height:28px;overflow: hidden; width: 300px">
                                        {{ post.title }}
                                    </h3>
                                </template>
                            </el-popconfirm>

                            <h4 style="padding: 0 20px;overflow: hidden;margin: 5px 0">内容：</h4>
                            <p style="padding: 0 20px;margin-bottom: 15px; margin-top: 0;overflow: hidden;">
                                {{ post.content }}
                            </p>
                            <h4 style="padding: 0 20px;overflow: hidden;margin: 5px 0">举报理由：</h4>
                            <div style="margin-bottom: 10px">
                                <el-text tag="i"
                                         v-for="index in Array.from({length: post.reasons.length}, (_, index) => index)"
                                         :key="index" style="padding: 0 40px;overflow: hidden;white-space: pre-line">
                                    {{ (index + 1) + ': ' + post.reasons[index] + '\n' }}
                                </el-text>
                            </div>
                        </div>
                        <el-dialog v-model="examine_3_1_dialog_show" :show-close="true" title="帖子审核">
                            <el-form :model="report_post_result" label-width="120px">
                                <el-form-item label="举报结果">
                                    <el-radio-group v-model="report_post_result.result">
                                        <el-radio label="0">举报失败</el-radio>
                                        <el-radio label="1">举报成功、帖子整改</el-radio>
                                        <el-radio label="2">举报成功、帖子删除</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item v-if="report_post_result.result==='1'||report_post_result.result==='2'"
                                              label="整改建议">
                                    <el-input v-model="report_post_result.basis" type="textarea"
                                              maxlength="100"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="examine_post_report_submit">确定</el-button>
                                    <el-button @click="examine_3_1_dialog_show=false">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                    </div>
                    <div v-else-if="show_info===4">
                        <div v-if="report_replies.length === 0">
                            <el-empty description="没有被举报的回复"/>
                        </div>
                        <div v-for="reply in report_replies" :key="reply.id"
                             style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 98%; margin-bottom: 20px"
                             @click.right="show_dialog_3_2(reply.id, reply.type)">
                            <el-popconfirm title="确定跳转到回复？" :hide-icon=true :hide-after=0 width="200"
                                           confirm-button-text="确定" cancel-button-text="取消"
                                           @confirm="browseReply(reply.post_id, reply.floor_id)">
                                <template #reference>
                                    <h3 class="link_hover"
                                        style="padding: 0 20px;margin-bottom: 5px; height:28px;overflow: hidden; width: 300px">
                                        {{ (reply.type === 0 ? 'Floor: ' : 'Comment: 回复') + reply.layer + '楼' }}
                                    </h3>
                                </template>
                            </el-popconfirm>

                            <h4 style="padding: 0 20px;overflow: hidden;margin: 5px 0">内容：</h4>
                            <p style="padding: 0 20px;margin-bottom: 15px; margin-top: 0;overflow: hidden;">
                                {{ reply.content }}
                            </p>
                            <h4 style="padding: 0 20px;overflow: hidden;margin: 5px 0">举报理由：</h4>
                            <div style="margin-bottom: 10px">
                                <el-text tag="i"
                                         v-for="index in Array.from({length: reply.reasons.length}, (_, index) => index)"
                                         :key="index" style="padding: 0 40px;overflow: hidden;white-space: pre-line">
                                    {{ (index + 1) + ': ' + reply.reasons[index] + '\n' }}
                                </el-text>
                            </div>
                        </div>
                        <el-dialog v-model="examine_3_2_dialog_show" :show-close="true" title="回复审核">
                            <el-form :model="report_reply_result" label-width="120px">
                                <el-form-item label="举报结果">
                                    <el-radio-group v-model="report_reply_result.result">
                                        <el-radio label="true">举报成功</el-radio>
                                        <el-radio label="false">举报失败</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item v-if="report_reply_result.result==='true'" label="理由">
                                    <el-input v-model="report_reply_result.basis" type="textarea"
                                              maxlength="100"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="examine_reply_report_submit">确定</el-button>
                                    <el-button @click="examine_3_2_dialog_show=false">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                    </div>
                    <div v-else>
                        error，出现意料外的菜单跳转！
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <CopyrightICP/>
        <MapPinInfo :id="show_marker_id" :is_examine="now_examine" @close_drawer="show_marker_id = -1"/>
    </div>
</template>

<style scoped>

.link_hover {
    cursor: pointer;
}

</style>