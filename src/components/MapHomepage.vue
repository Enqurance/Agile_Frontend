<template>
    <div :style="{width: screen_params.screenX+'px', height: screen_params.screenY+'px'}">
        <div id="container" style="width: 100%; height: 100%"></div>
    </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import {shallowRef} from "@vue/reactivity";
import {ElMessageBox, ElMessage} from "element-plus";
import global from "@/global";

export default {
    name: "MapHomepage",
    data() {
        let map = shallowRef(null)
        return {
            screen_params: {
                screenX: 0,
                screenY: 0
            },

            map,
            beihang_center: [
                116.347313,
                39.9813
            ],
            beihang_zoom: [
                16.5,
                20
            ],

            is_add_marker: false,
            click_marker_lnglat: [116.34731, 39.981],
            click_marker_simple_info: {
                id: 0,
                name: "add marker",
                type: 1,
                visibility: 0
            },

            markers_info: {
                null: {
                    name: null,
                    type: null,    // 决定marker样式
                    visibility: null,
                    lnglat: null
                }
            },

            is_delete_marker: false,
            delete_marker_id: 0,
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
                plugins: ['AMap.DistrictSearch', 'AMap.Polyline', 'AMap.Marker', 'AMap.ContextMenu', 'AMap.Pixel']
            }).then((AMap) => {
                let that = this

                this.map = new AMap.Map('container', {
                    viewMode: '3D',
                    zoom: 16.5,
                    center: that.beihang_center,
                    features: ['bg', 'road', 'building']
                })
                this.map.setZooms(that.beihang_zoom)

                let bounds = this.map.getBounds();
                this.map.setLimitBounds(bounds);

                this.init_markers()
                for (let marker_info in this.markers_info) {
                    let info = Object.assign({}, {
                        id: marker_info
                    }, that.markers_info[marker_info])
                    this.add_marker(info)
                }

                this.init_menu()
            }).catch(e => {
                console.log(e)
            })
        },
        init_markers() {
            this.markers_info = {}

            let that = this
            that.$axios.post('map/getUserAllBriefPin/' + global.global_user_id, {}, {
                headers: {
                    'token': global.global_token
                }
            }).then((res) => {
                for (let p_id in res.data.pins_info) {
                    let info = res.data.pins_info[p_id]

                    this.markers_info[p_id] = {
                        name: info.name,
                        type: info.type,
                        visibility: info.visibility,
                        lnglat: info.position
                    }
                }
            }).catch((res) => console.log(res))
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
                that.is_add_marker = true
                that.markers_info[that.click_marker_simple_info.id] = {
                    name: that.click_marker_simple_info.name,
                    type: that.click_marker_simple_info.type,    // 决定marker样式
                    visibility: that.click_marker_simple_info.visibility,
                    lnglat: that.click_marker_lnglat
                }
                console.log(that.markers_info)
                that.add_marker(Object.assign({}, that.click_marker_simple_info, {
                    lnglat: that.click_marker_lnglat
                }))
                contextMenu.close()
            }, 2);

            //地图绑定鼠标右击事件——弹出右键菜单
            this.map.on('rightclick', function (e) {
                that.click_marker_lnglat = [e.lnglat.lng, e.lnglat.lat]
                contextMenu.open(that.map, e.lnglat);
            });

        },
        add_marker(info) {
            // eslint-disable-next-line no-undef
            let marker = new AMap.Marker({
                map: this.map,
                position: info.lnglat,
                anchor: 'bottom-center',
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

            this.markers_info[info.id] = {
                name: info.name,
                type: info.type,
                visibility: info.visibility,
                lnglat: info.lnglat
            }
            marker.setMap(this.map)

            // delete_event
            let that = this
            marker.on('rightclick', function (e) {
                // console.log(e)
                if (e.target._opts.extData.visibility === 1) {
                    that.$message({
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
                        that.is_delete_marker = true
                        Reflect.deleteProperty(that.markers_info, that.delete_marker_id)
                        marker.setMap(null)
                        marker = null
                        ElMessage({
                            type: 'success',
                            message: '成功删除',
                        })
                        console.log(that.markers_info)
                    }).catch(() => {
                        ElMessage({
                            type: 'info',
                            message: '取消删除',
                        })
                    })
                }
            })
        },
    },
}
</script>

<style scoped>


</style>