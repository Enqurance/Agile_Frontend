<template>
    <div>
        <PlaceSearch class="on_div place_search" @submit_p_id="(e) => concentrate_pin(e)" :click_map="close_search"
                     @search_close="close_search=false"/>
        <div class="on_div" style="width: 100%;" >
            <MobileMapPinInfo :id="show_marker_id" @close_drawer="show_marker_id=-1" :is_examine="false" @update_info="update_pin"/>

            <div class="type_class">
                <el-checkbox-group v-model="checkedTypes" style="padding-left: 10%; width: 100px" @change="markers_change">
                    <el-checkbox v-for="type in types" :key="type" :label="type">
                        <span style="opacity: 1; color: black; font-weight: bolder">{{ type }}</span>
                    </el-checkbox>
                </el-checkbox-group>
            </div>

        </div>
        <div :style="{width: screen_params.screenX+'px', height: screen_params.screenY+'px'}" class="bottom_div">
            <div id="container" style="width: 100%; height: 100%" @touchend="close_search=true"></div>
        </div>
        <MapPinAdd :is_add_pin="is_add_marker" :lnglat="click_marker_lnglat" @addMarker="(e) => new_pin(e)"
                   @close_dialog="this.is_add_marker = false"/>
        <SwitchPos
            :is_switch="is_switch"
            :lnglat="click_marker_lnglat"
            @close_dialog="this.is_switch = false"
            @switch_pos="switch_pos"/>
        <el-menu v-if="menu_isopen" class="on_div" :style="{left: menu_xy[0]+'px', top: menu_xy[1]+'px'}">
            <el-menu-item index="1" @click="menu_1_click">
                聚焦北航
            </el-menu-item>
            <el-menu-item index="2" @click="menu_2_click">
                移动钉子
            </el-menu-item>
            <el-menu-item index="3" @click="menu_3_click">
                添加标记
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import {shallowRef} from "@vue/reactivity";
import {ElMessageBox, ElMessage} from "element-plus";
import MobileMapPinInfo from "@/components/mobile/sub_components/MobileMapPinInfo.vue";
import MapPinAdd from "@/components/sub_components/mappage_sub_components/MapPinAdd.vue";
import PlaceSearch from "@/components/sub_components/mappage_sub_components/PlaceSearch.vue";
import global from "@/global";
import '../../assets/PinIcon/font2/iconfont.css'
import SwitchPos from "@/components/sub_components/mappage_sub_components/SwitchPos.vue";
import {ref} from "vue";


export default {
    name: "MobileMapHomepage",
    components: {
        MobileMapPinInfo,
        MapPinAdd,
        PlaceSearch,
        SwitchPos
    },
    setup() {
        const start_touch_time = ref(0)
        const timeout = ref(null)
        return {
            start_touch_time,
            timeout
        }
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
                39.9820
            ],
            beihang_zoom: [
                16,
                20
            ],

            is_add_marker: false,
            is_switch: false,
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


            menu_xy: [],
            menu_isopen: false,
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
                this.map.setZooms(that.beihang_zoom)

                // let bounds = this.map.getBounds();
                // this.map.setLimitBounds(bounds);

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
        switch_pos (info) {
            // this.markers[info["id"]].setPosition
            // console.log(this.marker["lnglat"])
            let marker = this.markers[info["id"]].marker
            let lnglat = info["lnglat"].split(";")
            // console.log(lnglat.map(Number))
            this.markers_info[info["id"]].lnglat = lnglat.map(Number)
            marker.setPosition(lnglat)
            marker.setMap(this.map)
            // marker.setPosition()
        },
        init_menu() {
            let that = this

            //地图绑定鼠标右击事件——弹出右键菜单
            this.map.on('touchstart', (e) => {
                that.menu_isopen = false
                that.timeout = window.setTimeout(() => {
                    that.click_marker_lnglat = [e.lnglat.lng, e.lnglat.lat]
                    that.menu_xy = [e.pixel.x, e.pixel.y]
                    that.menu_isopen = true

                }, 2000);
            })

            this.map.on('touchmove', () => {
                clearTimeout(that.timeout);
            });

            this.map.on('touchend', () => {
                clearTimeout(that.timeout);
            })

        },
        menu_1_click() {
            this.menu_isopen = false
            this.map.setCenter(this.beihang_center)
            this.map.setZoom(this.beihang_zoom[0])
        },
        menu_2_click() {
            this.menu_isopen = false
            if (!this.$cookies.get('user_token')) {
                this.$message({
                    message: '请先登录!',
                    type: "warning"
                })
                this.$router.push({path: '/login'})
            }
            this.is_switch = true
        },
        menu_3_click() {
            this.menu_isopen = false
            if (!this.$cookies.get('user_token')) {
                this.$message({
                    message: '请先登录!',
                    type: "warning"
                })
                this.$router.push({path: '/login'})
            }
            this.is_add_marker = true
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

            marker.on('touchstart', (e) => {
                that.menu_isopen = false
                that.start_touch_time = Date.now()
                that.timeout = window.setTimeout(() => {
                    if ((e.target._opts.extData.visibility === 1 && that.$cookies.get('user_type') === "0") || that.$cookies.get('user_type') === null) {
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
                }, 2000);
            });

            marker.on('touchmove', () => {
                clearTimeout(that.timeout);
            });

            marker.on('touchend', (e) => {
                // console.log(that.timeout)
                clearTimeout(that.timeout);
                if (Date.now() - that.start_touch_time < 500) {
                    that.show_marker_id = parseInt(e.target._opts.extData.id)
                }
            })

        },
        concentrate_pin(pin_id) {
            this.map.setCenter(this.markers_info[pin_id].lnglat)
            this.map.setZoom(18)
        },
        update_pin(e) {
            let info = this.markers_info[e.id]
            if (info.name !== e.name || info.type !== e.type) {
                // console.log(1)
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
                for (let i = 0; i < this.last_types.length; i++) {
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
                for (let i = 0; i < this.checkedTypes.length; i++) {
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
    margin-top: 15%;
    border-radius: 7px
}

.bottom_div {
    top: 0;
    position: absolute;
    z-index: 1;
}

.place_search {
    width: 50%;
    margin-top: 15%;
    margin-left: 3%
}

el-menu {
    position: relative;
    width: 20%
}

</style>