<script>
import {ref,  toRaw} from 'vue'
import global from "@/global";
import { useRouter } from 'vue-router';

export default {
  setup(){
    let isVisited = ref(true);
    let token = global.global_token;
    if(token == ''){
      isVisited = true;
    }
    let router = useRouter()
    let page = toRaw(router).currentRoute.value.fullPath;
    console.log(page);
    let isMap = ref(false);
    let isForum = ref(false);
    let isInfor = ref(true);
    if(page === '/home'){
      isMap = true;
      isForum = false;
      isInfor = false;
    }else if(page === '/Infor'){
      isMap = false;
      isForum = false;
      isInfor = true;
    }else if(page === '/forum'){
      isMap = false;
      isForum = true;
      isInfor = false;
    }

    return {isMap, isForum, isInfor, isVisited};
  },
  methods: {
    clickToMap(){
      this.$router.push({
        path: '/home',
        query: {
        },
      });
    },
    clickToInfor(){
      this.$router.push({
        path: '/InforPage',
        query: {
        },
      });
    },
    clickToForum(){
      this.$router.push({
        path: '/',
        query: {
        },
      });
    },
    clickToLogin(){
      this.$router.push({
        path: '/login',
        query: {
        },
      });
    },
  },
}
</script>

<template>
  <div class="boby">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="col">
          <span style="font-weight:550 ;margin-left:10%">BUAAMapForum</span>
        </div>
      </el-col>
      <el-col :span="6">
        <el-button v-on:click="clickToMap()" class="tag" text :bg="this.isMap"><span style="font-weight:500;">Map</span></el-button>
      </el-col>
      <el-col :span="6">
        <div class="col">
          <el-button v-on:click="clickToForum()" class="tag" text :bg="this.isForum"><span>Forum</span></el-button>
        </div>
      </el-col>
      <el-col :span="6">
        <div v-if="isVisited" class="col">
          <el-button v-on:click="clickToLogin()" class="tag" text :bg="this.isInfor"><span>Login</span></el-button>
        </div>
        <div v-else class="col">
          <el-button v-on:click="clickToInfor()" class="tag" text :bg="this.isInfor"><span>Infor</span></el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.class{
  margin-top: 5%;
}
.el-col el-col-6 is-guttered{
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.col{
  margin: 0;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.tag{
  height: 100%;
  width: 100%;
}
span{
  font-size: 120%;
}
a{
  font-size: 120%;
  font-weight: 550;
}
</style>