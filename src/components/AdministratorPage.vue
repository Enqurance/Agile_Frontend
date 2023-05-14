<script>
import {defineComponent} from 'vue'
import PCPageHeader from "@/components/pc/PCPageHeader.vue";
import {Document, Location, Menu as IconMenu,} from "@element-plus/icons-vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {shallowRef} from "@vue/reactivity";
import global from "@/global";
import MapPinInfo from "@/components/sub_components/MapPinInfo.vue";

export default defineComponent({
    name: "AdministratorPage",
    components: {
        MapPinInfo,
        Document,
        Location,
        IconMenu,
        PCPageHeader
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
                    feedback_id: Number,
                    feedback: String
                }
            ],
            feedback_id_list: [],
            examine_1_2_dialog_show: false,
            pin_feedback_result: {
                pin_id: Number,
                feedback_id_list: [],
                info: String
            }
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
                    that.feedback_id_list = null
                    that.pin_apply_public_result.result = 'false'
                    that.pin_apply_public_result.id = e.target._opts.extData.id
                    that.pin_feedback_result.id = e.target._opts.extData.id
                    // console.log(that.markers_info[parseInt(e.target._opts.extData.id)].visibility)
                    that.markers_info[parseInt(e.target._opts.extData.id)].visibility === 0 ? that.examine_1_1_dialog_show = true : that.get_pin_feedback_list()
                })

                marker.setMap(that.map)
            }

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

                let bounds = that.map.getBounds();
                that.map.setLimitBounds(bounds);

                that.markers_info = {}
                that.$axios.get('examine/get_pin', {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    }
                }).then((res) => {
                    that.markers_info = {}
                    //todo
                    // for (let pin of res.data.data) {
                    //     that.markers_info[pin["id"]] = {
                    //         'name': pin["name"],
                    //         'type': pin["type"],
                    //         'lnglat': pin["lnglat"],
                    //         'visibility': pin["visibility"]
                    //     }
                    // }
                    that.markers_info[res.data.data[0]["id"]] = {
                        'name': '1',
                        'type': res.data.data[0]["type"],
                        'lnglat': res.data.data[0]["lnglat"],
                        'visibility': 1
                    }
                    for (let marker_info in that.markers_info) {
                        let info = Object.assign({}, {
                            id: marker_info
                        }, that.markers_info[marker_info])
                        // console.log(marker_info)
                        add_marker(info)
                    }
                }).catch((res) => {
                    console.log(res)
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
            }).then(() => {
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
                that.$message({
                    type: 'success',
                    message: 'pin审核结果成功提交后端！',
                    showClose: true
                })
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
            that.feedback_list = [{
                'feedback_id': 1,
                'feedback': '12'
            }, {
                'feedback_id': 2,
                'feedback': '34'
            }, {
                'feedback_id': 2,
                'feedback': '322222222222222222222222222222222222222222222222222222222222222222222222222222222222222222224'
            },
            ]
            that.examine_1_2_dialog_show = true
            // that.$axios.get('examine/get_feedback/' + that.pin_feedback_result.id, {
            //     headers: {
            //         'token': that.$cookies.get('user_token')
            //     }
            // }).then((res) => {
            //todo
            //     that.feedback_list = res.data
            //     that.examine_1_1_dialog_show = true
            // }).catch((error) => {
            //     console.log(error)
            // })
        },
        examine_pin_feedback_submit() {
            let that = this
            that.examine_1_2_dialog_show = false
        }
    },
    watch: {
        feedback_id_list(newData) {
            // console.log(newData)
        }
    }

})
</script>

<template>
    <div style="height: 100%">
        <el-container style="height: 100%">
            <el-header>
                <PCPageHeader/>
            </el-header>
            <el-container style="height: 100%">
                <el-aside style="width: 20%">
                    <el-menu :default-openeds="['3']" style="height: 100%" default-active="1">
                        <el-menu-item index="1" @click="() => {show_info=1;this.init_map();}">
                            <el-icon>
                                <location/>
                            </el-icon>
                            <template #title>{{ examine_list[0] }}</template>
                        </el-menu-item>
                        <el-menu-item index="2" @click="show_info=2">
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
                                <el-menu-item index="3-1" @click="show_info=3">{{ report_list[0] }}</el-menu-item>
                                <el-menu-item index="3-2" @click="show_info=4">{{ report_list[1] }}</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main style="height: 100%">
                    <div v-if="show_info===1" style="height: 100%">
                        <div id="container" style="width: 100%; height: 100%"></div>
                        <el-dialog v-model="examine_1_1_dialog_show" :show-close="true" title="公共pin申请">
                            <el-form :model="pin_apply_public_result" label-width="120px">
                                <el-form-item label="feedback result">
                                    <el-radio-group v-model="pin_apply_public_result.result">
                                        <el-radio label="true">同意</el-radio>
                                        <el-radio label="false">拒绝</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="feedback info">
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
                                        <el-option v-for="item in feedback_list" :label="item.feedback"
                                                   :value="item.feedback_id" :key="item.feedback_id"/>
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
                </el-main>
            </el-container>
        </el-container>

        <MapPinInfo :id="show_marker_id" :is_examine="now_examine" @close_drawer="show_marker_id = -1"/>
    </div>
</template>

<style scoped>


</style>