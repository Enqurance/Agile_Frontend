<template>
  <div>
    <PlaceSearch class="on_div place_search" @submit_p_id="(e) => concentrate_pin(e)" :click_map="close_search"
                 @search_close="close_search=false"/>
    <div class="on_div" style="width: 100%;">
      <MobileMapPinInfo :id="show_marker_id" @close_drawer="show_marker_id=-1" :is_examine="false"
                        @update_info="update_pin"/>

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
    <MobileMapPinAdd :is_add_pin="is_add_marker" :lnglat="click_marker_lnglat" @addMarker="(e) => new_pin(e)"
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
import MobileMapPinInfo from "@/components/mobile/sub_components/mappage_sub_components/MobileMapPinInfo.vue";
import PlaceSearch from "@/components/sub_components/mappage_sub_components/PlaceSearch.vue";
import global from "@/global";
import '../../assets/PinIcon/font2/iconfont.css'
import SwitchPos from "@/components/sub_components/mappage_sub_components/SwitchPos.vue";
import {ref} from "vue";
// import {GPS} from '@/gps'


export default {
  name: "MobileMapHomepage",
  components: {
    MobileMapPinInfo,
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
      // currentTime: null,

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
        14.5,
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

      cluster: null,
      markerClusterers: [],
      renderClusterMarker_style: Object,
      renderMarker_style: Object
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
  beforeUnmount() {
    // clearInterval(this.timer)
  },
  methods: {
    init_map() {
      AMapLoader.load({
        key: '159f00b0e9d69324ced6b97a73f6883b',
        version: '2.0',
        plugins: ['AMap.DistrictSearch', 'AMap.Polyline', 'AMap.Marker', 'AMap.ContextMenu', 'AMap.Pixel',
          'AMap.Icon', ' AMap.Size']
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

        // AMap.plugin('AMap.Geolocation', () => {
        //     let geolocation = new AMap.Geolocation({
        //         enableHighAccuracy: true,//是否使用高精度定位，默认:true
        //         maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        //         convert: false,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        //         showButton: false,        //显示定位按钮，默认：true
        //         showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        //         showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
        //         panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
        //         GeoLocationFirst: true,
        //     })
        //
        //     this.map.addControl(geolocation)
        //     geolocation.getCurrentPosition((statue, result) => {
        //         if (statue === 'complete') {
        //             // console.log('gps_lng:' + result.position.lng)
        //             // console.log('gps_lat:' + result.position.lat)
        //             onComplete(result)
        //         }
        //         else {
        //             onError(result)
        //         }
        //     })
        //
        //     this.timer = setInterval(() => {
        //         this.currentTime = new Date().toLocaleTimeString()
        //         geolocation.getCurrentPosition(() => {
        //
        //         })
        //     }, 30000)
        //
        //     function onComplete (data) {
        //         geolocation._marker.setPosition([data.position.getLng(), data.position.getLat()])
        //
        //         that.$message({
        //             // message: '定位成功lnglat: ' + lng + ', ' + lat,
        //             message: '定位成功',
        //             type: 'success',
        //             showClose: true,
        //         })
        //     }
        //
        //     function onError (data) {
        //         // 定位出错
        //         // console.log(data)
        //         that.$message({
        //             message: data.message,
        //             type: 'error'
        //         })
        //     }
        // })

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

          this.init_cluster()

          this.init_menu()
        }).catch((res) => {
          console.log(res)
        })
      }).catch(e => {
        console.log(e)
      })
    },
    init_cluster() {
      let that = this
      // 创建点聚合
      // 设置聚合之后点的样式
      this.renderClusterMarker_style = function (context) {
        // 选取聚合的marker中weight最大的点展示，即第0个
        const show_marker = context.clusterData[0];
        const content = "<div style='width: 100px; display: flex; opacity:" + that._get_pin_opacity(show_marker.type) + "; color: "+ that._get_pin_color(show_marker.type) +";'>"+ '<div style=\"color:' + that._get_pin_color(show_marker.type) + '\"><span class="iconfont icon-location-full icon_class" ></span></div>' + show_marker.name + "</div>";
        const offset = new AMap.Pixel(-10.5, -12);
        context.marker.setContent(content)
        context.marker.setOffset(offset)

        // 点击预定长按，若中途取消点击则用clearTimeout()取消长按方法
        context.marker.on('touchstart', function () {
          that.menu_isopen = false
          that.start_touch_time = Date.now()
          that.timeout = window.setTimeout(() => {
            if ((show_marker.visibility === 1 && that.$cookies.get('user_type') === "0") || that.$cookies.get('user_type') === null) {
              that.$message({
                grouping: true,
                message: '系统点标记不可删除',
                type: "warning"
              })
            } else {
              ElMessageBox.confirm(
                  '确认删除该地图钉？',
                  'Warning',
                  {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                  }
              ).then(() => {
                that.delete_marker_id = show_marker.id

                that.$axios.delete('map/pin/deletePin/' + that.delete_marker_id, {
                  headers: {
                    'token': that.$cookies.get('user_token')
                  }
                }).then(() => {
                  delete that.markers_info[that.delete_marker_id]
                  Reflect.deleteProperty(that.markers_info, that.delete_marker_id)
                  // 从cluster中删除
                  delete that.markerClusterers[that.delete_marker_id]
                  Reflect.deleteProperty(that.markerClusterers, that.delete_marker_id)

                  that.create_cluster()

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
          }, 2000)
        })

        context.marker.on('touchmove', function() {
          clearTimeout(that.timeout);
        })

        context.marker.on('touchend', function () {
          clearTimeout(that.timeout);
          if (Date.now() - that.start_touch_time < 500) {
            that.show_marker_id = parseInt(show_marker.id)
          }
        })
      };
      // 设置聚合之前点的样式
      this.renderMarker_style = function (context) {
        const content = "<div style='width: 100px; display: flex; opacity:" + that._get_pin_opacity(context.data[0].type) + "; color: "+ that._get_pin_color(context.data[0].type) +";'>"+ '<div style=\"color:' + that._get_pin_color(context.data[0].type) + '\"><span class="iconfont icon-location-full icon_class" ></span></div>' + context.data[0].name + "</div>";
        const offset = new AMap.Pixel(-10.5, -12);
        context.marker.setContent(content)
        context.marker.setOffset(offset)

        // 点击预定长按，若中途取消点击则用clearTimeout()取消长按方法
        context.marker.on('touchstart', function () {
          that.menu_isopen = false
          that.start_touch_time = Date.now()
          that.timeout = window.setTimeout(() => {
            if ((context.data[0].visibility === 1 && that.$cookies.get('user_type') === "0") || that.$cookies.get('user_type') === null) {
              that.$message({
                grouping: true,
                message: '系统点标记不可删除',
                type: "warning"
              })
            } else {
              ElMessageBox.confirm(
                  '确认删除该地图钉？',
                  'Warning',
                  {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                  }
              ).then(() => {
                that.delete_marker_id = context.data[0].id

                that.$axios.delete('map/pin/deletePin/' + that.delete_marker_id, {
                  headers: {
                    'token': that.$cookies.get('user_token')
                  }
                }).then(() => {
                  delete that.markers_info[that.delete_marker_id]
                  Reflect.deleteProperty(that.markers_info, that.delete_marker_id)
                  // 从cluster中删除
                  delete that.markerClusterers[that.delete_marker_id]
                  Reflect.deleteProperty(that.markerClusterers, that.delete_marker_id)

                  that.create_cluster()

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
          }, 2000)
        })

        context.marker.on('touchmove', function() {
          clearTimeout(that.timeout);
        })

        context.marker.on('touchend', function () {
          clearTimeout(that.timeout);
          if (Date.now() - that.start_touch_time < 500) {
            that.show_marker_id = parseInt(context.data[0].id)
          }
        })
      }

      // 构建初始化的marker
      for (let i in this.markers_info) {
        this.add_marker(Object.assign({}, {'id': i, 'weight': parseInt(i)}, this.markers_info[i]))
      }

      // 启动点聚合
      this.create_cluster()
    },
    switch_pos(info) {
      let lnglat = info["lnglat"].split(";")
      this.markers_info[info["id"]].lnglat = lnglat.map(Number)
      this.markerClusterers[info["id"]] = Object.assign({}, {
        'id': info.id,
        'weight': parseInt(info.id)
      }, this.markers_info[info.id])
      this.create_cluster()
    },
    init_menu() {
      let that = this

      //地图绑定鼠标右击事件——弹出右键菜单
      console.log("event")
      this.map.on('touchstart', (e) => {
        that.menu_isopen = false
        if (e.touches > 1) {
          clearTimeout(that.timeout)
          return
        }
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
      this.create_cluster()
      this.concentrate_pin(this.click_marker_simple_info.id)
    },
    add_marker(info) {
      // eslint-disable-next-line no-undef
      this.markers_info[info.id] = {
        name: info.name,
        type: info.type,
        visibility: info.visibility,
        lnglat: info.lnglat
      }

      this.markerClusterers[info.id] = Object.assign({}, {
        'id': info.id,
        'weight': parseInt(info.id)
      }, this.markers_info[info.id])

      this.show_types[this._get_pin_type(info.type)].push(this.markerClusterers[info.id])
      //
      // // show_event
      // let that = this
      //
      // marker.on('touchstart', (e) => {
      //   that.menu_isopen = false
      //   that.start_touch_time = Date.now()
      //   that.timeout = window.setTimeout(() => {
      //     if ((e.target._opts.extData.visibility === 1 && that.$cookies.get('user_type') === "0") || that.$cookies.get('user_type') === null) {
      //       that.$message({
      //         grouping: true,
      //         message: '系统点标记不可删除',
      //         type: "warning"
      //       })
      //     } else {
      //       ElMessageBox.confirm(
      //           '确认删除该地图钉？',
      //           'Warning',
      //           {
      //             confirmButtonText: '确认',
      //             cancelButtonText: '取消',
      //             type: 'warning',
      //           }
      //       ).then(() => {
      //         that.delete_marker_id = e.target._opts.extData.id
      //
      //         that.$axios.delete('map/pin/deletePin/' + that.delete_marker_id, {
      //           headers: {
      //             'token': that.$cookies.get('user_token')
      //           }
      //         }).then(() => {
      //           delete that.markers_info[that.delete_marker_id]
      //           Reflect.deleteProperty(that.markers_info, that.delete_marker_id)
      //           marker.setMap(null)
      //           // console.log(marker)
      //           marker = null
      //           ElMessage({
      //             type: 'success',
      //             message: '成功删除',
      //           })
      //         }).catch((res) => console.log(res))
      //       }).catch(() => {
      //         ElMessage({
      //           type: 'info',
      //           message: '取消删除',
      //         })
      //       })
      //     }
      //   }, 2000);
      // });
      //
      // marker.on('touchmove', () => {
      //   clearTimeout(that.timeout);
      // });
      //
      // marker.on('touchend', (e) => {
      //   // console.log(that.timeout)
      //   clearTimeout(that.timeout);
      //   if (Date.now() - that.start_touch_time < 500) {
      //     that.show_marker_id = parseInt(e.target._opts.extData.id)
      //   }
      // })

    },
    concentrate_pin(pin_id) {
      this.map.setCenter(this.markers_info[pin_id].lnglat)
      this.map.setZoom(18)
    },
    update_pin(e) {
      let info = this.markers_info[e.id]
      if (info.name !== e.name || info.type !== e.type) {
        this.markers_info[e.id] = {
          name: e.name,
          type: e.type,    // 决定marker样式
          visibility: this.markers_info[e.id].visibility,
          lnglat: this.markers_info[e.id].lnglat
        }
        this.markerClusterers[e.id] = Object.assign({}, {'id': e.id, 'weight': parseInt(e.id)}, this.markers_info[e.id])
        this.create_cluster()
      }
    },
    markers_change() {
      let current_clusters = []

      for (const tag of Object.values(this.checkedTypes)) {
        current_clusters = current_clusters.concat(this.show_types[tag])
      }

      console.log(current_clusters)
      let that = this
      this.map.plugin(["AMap.MarkerClusterer"], function () {
        if (that.cluster) {
          that.cluster.setMap(null)
          that.cluster = null
        }
        that.cluster = new AMap.MarkerClusterer(
            that.map,
            Object.values(current_clusters),
            {
              renderClusterMarker: that.renderClusterMarker_style,
              renderMarker: that.renderMarker_style,
            });
      });
    },
    _get_pin_type(pin_type_id) {
      return global.get_pin_type(pin_type_id)
    },
    _get_pin_color(pin_type_id) {
      return global.get_pin_color(pin_type_id)
    },
    _get_pin_opacity(pin_type_id) {
      switch (pin_type_id) {
        case 1: return 1;
        case 2: return 1;
        case 3: return 1;
        case 4: return 1;
        case 5: return 1;
        case 6: return 1;
        case 7: return 1;
      }
    },
    create_cluster() {
      let that = this
      this.map.plugin(["AMap.MarkerClusterer"], function () {
        if (that.cluster) {
          that.cluster.setMap(null)
          that.cluster = null
        }
        that.cluster = new AMap.MarkerClusterer(
            that.map,     // 地图实例
            Object.values(that.markerClusterers), // 海量点数据，数据中需包含经纬度信息字段 lnglat
            {
              renderClusterMarker: that.renderClusterMarker_style, // 自定义聚合点样式
              renderMarker: that.renderMarker_style, // 自定义非聚合点样式
            });
      });
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