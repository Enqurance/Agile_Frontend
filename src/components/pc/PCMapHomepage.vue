<template>
  <div>
    <!--        <el-header height="7%">-->
    <PageHeader style="position: fixed; top: 0; width: 100%; z-index: 3;"/>
    <!--        </el-header>-->
    <!--        <el-main style="height: 93%">-->
    <PlaceSearch class="on_div place_search" :style="{}"
                 @submit_p_id="(e) => concentrate_pin(e)" :click_map="close_search"
                 @search_close="close_search=false"/>
    <div class="on_div" style="width: 100%;">
      <MapPinInfo :id="show_marker_id" :is_examine="false" @close_drawer="show_marker_id = -1"
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
      <div id="container" style="width: 100%; height: 100%" @click="close_search=true"></div>
      <CopyrightICP/>
    </div>
    <MapPinAdd
        :is_add_pin="is_add_marker"
        :lnglat="click_marker_lnglat"
        @addMarker="(e) => new_pin(e)"
        @close_dialog="this.is_add_marker = false"/>
    <!--        </el-main>-->
    <SwitchPos
        :is_switch="is_switch"
        :lnglat="click_marker_lnglat"
        @close_dialog="this.is_switch = false"
        @switch_pos="switch_pos"/>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import {shallowRef} from "@vue/reactivity";
import {ElMessageBox, ElMessage} from "element-plus";
import MapPinInfo from "@/components/pc/sub_components/mappage_sub_components/MapPinInfo.vue";
import MapPinAdd from "@/components/pc/sub_components/mappage_sub_components/MapPinAdd.vue";
import PlaceSearch from "@/components/sub_components/mappage_sub_components/PlaceSearch.vue";
import PageHeader from "@/components/pc/PCPageHeader.vue";
import SwitchPos from "@/components/sub_components/mappage_sub_components/SwitchPos.vue"
import global from "@/global";
import '../../assets/PinIcon/font2/iconfont.css'
import CopyrightICP from "@/components/CopyrightICP.vue";


export default {
  name: "PCMapHomepage",
  components: {
    MapPinInfo,
    MapPinAdd,
    PlaceSearch,
    PageHeader,
    SwitchPos,
    CopyrightICP,
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
        // console.log(context)
        // 选取聚合的marker中weight最大的点展示，即第0个
        const show_marker = context.clusterData[0];
        const content = "<div style='width: 100px; display: flex; opacity:" + that._get_pin_opacity(show_marker.type) 
            + "; color: "+ that._get_pin_color(show_marker.type) +";'>"
            + '<div style=\"color:' + that._get_pin_color(show_marker.type) 
            + '; font-family: "Microsoft Yahei;"\"><span class="iconfont icon-location-full icon_class" ></span></div>' 
            + "<span style=\"font-weight: 550;\">" + show_marker.name + "</span></div>";
        const offset = new AMap.Pixel(-10.5, -12);
        context.marker.setContent(content)
        context.marker.setOffset(offset)

        // show event
        context.marker.on('click', function () {
          that.show_marker_id = parseInt(show_marker.id)
        })

        // delete_event
        context.marker.on('rightclick', function () {
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
        })
      };
      // 设置聚合之前点的样式
      this.renderMarker_style = function (context) {
        // console.log(context)
        const content = "<div style='width: 100px; font-family: \"Microsoft Yahei\"; display: flex; opacity:" 
            + that._get_pin_opacity(context.data[0].type) 
            + "; color: "+ that._get_pin_color(context.data[0].type) +";'>"
            + '<div style=\"color:' + that._get_pin_color(context.data[0].type) 
            + '; \"><span class="iconfont icon-location-full icon_class" ></span></div>' 
            + "<span style=\"font-weight: 550;\">" + context.data[0].name + "</span></div>";
        const offset = new AMap.Pixel(-10.5, -12);
        context.marker.setContent(content)
        context.marker.setOffset(offset)

        // show event
        context.marker.on('click', function () {
          that.show_marker_id = parseInt(context.data[0].id)
        })

        // delete_event
        context.marker.on('rightclick', function () {
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
        } else {
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
        } else {
          that.map.zoomOut();
        }
      }, 1);

        //聚焦北航
        contextMenu.addItem("聚焦北航", function () {
            that.map.setCenter(that.beihang_center)
            that.map.setZooms(that.beihang_zoom[0])
            contextMenu.close()
        }, 2);

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
      }, 3);

      contextMenu.addItem("移动钉子", function () {
        if (!that.$cookies.get('user_token')) {
          that.$message({
            message: '请先登录!',
            type: "warning"
          })
          that.$router.push({path: '/login'})
        }
        that.is_switch = true
        contextMenu.close()
      }, 4);

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
  margin-top: 7%;
  border-radius: 7px
}

.bottom_div {
  color: rgb(239, 184, 5);
  top: 0;
  position: absolute;
  z-index: 1;
}

.place_search {
  width: 18%;
  margin-top: 7%;
  margin-left: 3%
}

</style>