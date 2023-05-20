<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "MobileNavigator",
    data() {
        return {
            tabbar_model: 0
        }
    },
})
</script>

<template>
    <div>
        <van-tabbar v-model="tabbar_model">
            <van-tabbar-item :key="0" to="/home">Map</van-tabbar-item>
            <van-tabbar-item :key="1" to="/forum">Forum</van-tabbar-item>
            <van-tabbar-item v-if="this.$cookies.get('user_token') !== null" :key="2" to="/InforPage">我的信息</van-tabbar-item>
            <van-tabbar-item v-else :key="3" to="/login">登录</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<style scoped>

</style>