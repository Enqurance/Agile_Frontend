<template>
    <div>
        <!--        <el-header height="7%">-->
        <PageHeader style="position: fixed; top: 0; width: 100%; z-index: 3; background: black; opacity: 0.3"/>
        <!--        </el-header>-->
        <!--        <el-main style="height: 93%">-->
        <div class="on_div">
            <PlaceSearch style="width: 18%; height: 30%; margin-top: 5%; margin-left: 3%"
                         @submit_p_id="(e) => concentrate_pin(e)" :click_map="close_search"
                         @search_close="close_search=false"/>
            <MapPinInfo :id="show_marker_id" @close_drawer="show_marker_id = -1" @update_info="update_pin"/>

            <div class="type_class">
                <el-checkbox-group v-model="checkedTypes" style="padding-left: 10%; width: 100px" @change="markers_change">
                    <el-checkbox v-for="type in types" :key="type" :label="type">
                        <span style="opacity: 1; color: black; font-weight: bolder">{{ type }}</span>
                    </el-checkbox>
                </el-checkbox-group>
            </div>

        </div>
        <div :style="{width: screen_params.screenX+'px', height: screen_params.screenY+'px'}" class="bottom_div">
            <div id="container" style="width: 100%; height: 100%" @click="close_search=true"></div>
        </div>
        <MapPinAdd :is_add_pin="is_add_marker" :lnglat="click_marker_lnglat" @addMarker="(e) => new_pin(e)"
                   @close_dialog="this.is_add_marker = false"/>
        <!--        </el-main>-->
    </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import {shallowRef} from "@vue/reactivity";
import {ElMessageBox, ElMessage} from "element-plus";
import MapPinInfo from "@/components/MapPinInfo.vue";
import MapPinAdd from "@/components/MapPinAdd.vue";
import PlaceSearch from "@/components/PlaceSearch.vue";
import PageHeader from "@/components/PageHeader";
import global from "@/global";
import '../assets/PinIcon/font2/iconfont.css'


export default {
    name: "MapHomepage",
    components: {
        MapPinInfo,
        MapPinAdd,
        PlaceSearch,
        PageHeader,
    },
    data() {
        let map = shallowRef(null)
        return {
            close_search: false,

            screen_params: {
                screenX: 0,
                screenY: 0
            },

            map,
            beihang_center: [
                116.347313,
                39.9817
            ],
            beihang_zoom: [
                16.2,
                20
            ],

            is_add_marker: false,
            click_marker_lnglat: [],
            click_marker_simple_info: {
                id: 0,
                name: "add marker",
                type: 1,
                visibility: 0
            },

            is_show_marker: false,
            show_marker_id: -1,

            markers_info: Object,
            delete_marker_id: 0,

            center_pin_id: -1,

            markers: {},
            show_types: {
                "餐饮": [],
                "园地": [],
                "教学": [],
                "体育": [],
                "办公": [],
                "购物": [],
                "生活服务": [],
            },

            checkedTypes: [
                "餐饮",
                "园地",
                "教学",
                "体育",
                "办公",
                "购物",
                "生活服务",
            ],
            types: [
                "餐饮",
                "园地",
                "教学",
                "体育",
                "办公",
                "购物",
                "生活服务",
            ],
            last_types: [
                "餐饮",
                "园地",
                "教学",
                "体育",
                "办公",
                "购物",
                "生活服务",
            ],
        }
    },
    mounted() {
        document.oncontextmenu = () => {
            return false
        }

        this.screen_params.screenX = document.documentElement.clientWidth
        this.screen_params.screenY = document.documentElement.clientHeight
        // console.log(this.screen_params)
        this.init_map()
    },
    methods: {
        init_map() {
            AMapLoader.load({
                key: '159f00b0e9d69324ced6b97a73f6883b',
                version: '2.0',
                plugins: ['AMap.DistrictSearch', 'AMap.Polyline', 'AMap.Marker', 'AMap.ContextMenu', 'AMap.Pixel', 'AMap.Icon', ' AMap.Size']
            }).then((AMap) => {
                let that = this

                this.map = new AMap.Map('container', {
                    viewMode: '3D',
                    zoom: 16.2,
                    center: that.beihang_center,
                    // layers: [
                    //     // 卫星
                    //     new AMap.TileLayer.Satellite(),
                    //     // 路网
                    //     new AMap.TileLayer.RoadNet()
                    // ],
                    features: ['bg', 'road', 'building']
                })
                this.map.setZooms(that.beihang_zoom)

                let bounds = this.map.getBounds();
                this.map.setLimitBounds(bounds);

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
                        // console.log(marker_info)
                        this.add_marker(info)
                    }

                    this.init_menu()
                    // console.log(that.markers)
                }).catch((res) => {
                    console.log(res)
                })
            }).catch(e => {
                console.log(e)
            })
        },
        init_menu() {
            //创建右键菜单
            // eslint-disable-next-line no-undef
            let contextMenu = new AMap.ContextMenu();
            let that = this

            //右键放大
            contextMenu.addItem("放大一级", function () {
                if (that.map.getZoom() === that.beihang_zoom[1]) {
                    that.$message({
                        message: '地图不可继续放大',
                        type: "warning"
                    })
                }
                else {
                    that.map.zoomIn();
                }
            }, 0);

            //右键缩小
            contextMenu.addItem("缩小一级", function () {
                if (that.map.getZoom() === that.beihang_zoom[0]) {
                    that.$message({
                        message: '地图不可继续缩小',
                        type: "warning"
                    })
                }
                else {
                    that.map.zoomOut();
                }
            }, 1);

            //右键添加Marker标记
            // eslint-disable-next-line no-unused-vars
            contextMenu.addItem("添加标记", function () {
                if (!that.$cookies.get('user_token')) {
                    that.$message({
                        message: '请先登录!',
                        type: "warning"
                    })
                    that.$router.push({path: '/login'})
                }
                that.is_add_marker = true
                contextMenu.close()
            }, 2);

            //地图绑定鼠标右击事件——弹出右键菜单
            this.map.on('rightclick', function (e) {
                that.click_marker_lnglat = [e.lnglat.lng, e.lnglat.lat]
                contextMenu.open(that.map, e.lnglat);
            });

        },
        new_pin(e) {
            this.is_add_marker = false

            this.click_marker_simple_info = e
            this.markers_info[this.click_marker_simple_info.id] = {
                name: this.click_marker_simple_info.name,
                type: this.click_marker_simple_info.type,    // 决定marker样式
                visibility: this.click_marker_simple_info.visibility,
                lnglat: this.click_marker_lnglat
            }
            this.add_marker(Object.assign({}, this.click_marker_simple_info, {
                lnglat: this.click_marker_lnglat
            }))
        },
        add_marker(info) {
            // eslint-disable-next-line no-undef
            let marker_content = '<div style=\"color:' + this._get_pin_color(info.type) + '\"><span class="iconfont icon-location-full icon_class" ></span></div>'
            let marker = new AMap.Marker({
                map: this.map,
                position: info.lnglat,
                anchor: 'bottom-center',
                content: marker_content,
                extData: {
                    id: info.id,
                    visibility: info.visibility
                }
            })

            marker.setLabel({
                // eslint-disable-next-line no-undef
                offset: new AMap.Pixel(0, -5),
                content: info.name,
                direction: 'top-center',
            })
            this.markers[info["id"]] = {
                marker: marker
            }
            // console.log(info)
            this.show_types[this._get_pin_type(info.type)].push(marker)
            // console.log(this.markers)

            this.markers_info[info.id] = {
                name: info.name,
                type: info.type,
                visibility: info.visibility,
                lnglat: info.lnglat
            }
            marker.setMap(this.map)
            // show_event
            let that = this
            marker.on('click', function (e) {
                that.show_marker_id = e.target._opts.extData.id
            })

            // delete_event
            marker.on('rightclick', function (e) {
                // console.log(e.target._opts.extData.visibility)
                // console.log(that.$cookies.get('user_type') === "0")
                if (e.target._opts.extData.visibility === 1 && that.$cookies.get('user_type') === "0") {
                    that.$message({
                        grouping: true,
                        message: '系统点标记不可删除',
                        type: "warning"
                    })
                }
                else {
                    ElMessageBox.confirm(
                        '确认删除该地图钉？',
                        'Warning',
                        {
                            confirmButtonText: '确认',
                            cancelButtonText: '取消',
                            type: 'warning',
                        }
                    ).then(() => {
                        that.delete_marker_id = e.target._opts.extData.id

                        that.$axios.delete('map/pin/deletePin/' + that.delete_marker_id, {
                            headers: {
                                'token': that.$cookies.get('user_token')
                            }
                        }).then(() => {
                            delete that.markers_info[that.delete_marker_id]
                            Reflect.deleteProperty(that.markers_info, that.delete_marker_id)
                            marker.setMap(null)
                            // console.log(marker)
                            marker = null
                            ElMessage({
                                type: 'success',
                                message: '成功删除',
                            })
                        }).catch((res) => console.log(res))
                    }).catch(() => {
                        ElMessage({
                            type: 'info',
                            message: '取消删除',
                        })
                    })
                }
            })
        },
        concentrate_pin(pin_id) {
            this.map.setCenter(this.markers_info[pin_id].lnglat)
            this.map.setZoom(18)
        },
        update_pin(e) {
            // console.log(this.markers_info[e.id])
            let info = this.markers_info[e.id]
            if (info.name !== e.name || info.type !== e.type) {
                console.log(1)
                this.markers_info[e.id] = {
                    name: e.name,
                    type: e.type,    // 决定marker样式
                    visibility: this.markers_info[e.id].visibility,
                    lnglat: this.markers_info[e.id].lnglat
                }
                let marker = this.markers[e.id].marker
                // console.log(marker)
                marker.setLabel({
                    // eslint-disable-next-line no-undef
                    offset: new AMap.Pixel(0, -5),
                    content: this.markers_info[e.id].name,
                    direction: 'top-center'
                })

                // console.log(this.markers_info[e.id])
            }
        },
        markers_change() {
            let type_name = ""
            let that = this
            if (this.checkedTypes.length < this.last_types.length) {
                for (let i = 0;i < this.last_types.length;i++) {
                    if (this.checkedTypes.indexOf(that.last_types[i]) === -1) {
                        type_name = this.last_types[i]
                        break
                    }
                }
                // console.log(type_name)
                let markers = this.show_types[type_name]
                for (let marker of markers) {
                    // console.log(marker)
                    marker.setMap(null)
                }
            }
            else {
                for (let i = 0;i < this.checkedTypes.length;i++) {
                    if (this.last_types.indexOf(that.checkedTypes[i]) === -1) {
                        type_name = this.checkedTypes[i]
                        break
                    }
                }
                // console.log(type_name)
                let markers = this.show_types[type_name]
                for (let marker of markers) {
                    // console.log(marker)
                    marker.setMap(this.map)
                }
            }
            this.last_types = this.checkedTypes
        },
        _get_pin_type(pin_type_id) {
            return global.get_pin_type(pin_type_id)
        },
        _get_pin_color(pin_type_id) {
            return global.get_pin_color(pin_type_id)
        }
    },
}
</script>

<style scoped>

.on_div {
    top: 0;
    position: absolute;
    width: 100%;
    z-index: 2;
}

.type_class {
    position: absolute;
    right: 2%;
    top: 10%;
    /*width: 7%;*/
    margin-right: 2%;
    background: #f0ffff;
    opacity: 0.7;
    margin-top: 4%;
    border-radius: 7px
}

.bottom_div {
    top: 0;
    position: absolute;
    z-index: 1;
}

.icon_class {

}


</style>