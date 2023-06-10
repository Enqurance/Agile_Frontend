<script>
import {defineComponent, markRaw} from 'vue'
import bus from "@/event-bus";

export default defineComponent({
    name: "MobileNavigator",
    mounted() {
        bus.on('force-update-tabbar', () => {
            this.count++
        })
    },
    data() {
        return {
            tabbar_model: 0,
            count: 0
        }
    },
})
</script>

<template>
    <div>
        <van-tabbar :key="count" v-model="tabbar_model" :route="true">
            <van-tabbar-item :key="4" to="/Intro">介绍</van-tabbar-item>
            <van-tabbar-item :key="0" to="/home">地图</van-tabbar-item>
            <van-tabbar-item :key="1" to="/forum">论坛</van-tabbar-item>
            <van-tabbar-item v-if="this.$cookies.get('user_token') !== null" :key="2" to="/InforPage">我的</van-tabbar-item>
            <van-tabbar-item v-else :key="3" to="/login">登录</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<style scoped>

</style>