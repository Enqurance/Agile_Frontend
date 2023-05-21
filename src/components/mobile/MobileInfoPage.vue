<script>
import { ref, reactive } from 'vue'
import { Tab, Tabs } from 'vant';
import { } from '@element-plus/icons-vue'
import MyInfo_Mobile from '@/components/mobile/sub_components/infopage_sub_components/MyInfo_Mobile.vue'
import MyComment_Mobile from '@/components/mobile/sub_components/infopage_sub_components/MyComment_Mobile.vue'
import MyMessage_Mobile from '@/components/mobile/sub_components/infopage_sub_components/MyMessage_Mobile.vue'
import MyPost_Mobile from '@/components/mobile/sub_components/infopage_sub_components/MyPost_Mobile.vue'

export default {
    name: "MobileInfoPage",
    components: {  MyInfo_Mobile, MyComment_Mobile, MyMessage_Mobile, MyPost_Mobile },
    setup(){
        let Index = ref('1');
        return { Index,}
    },
    methods: {

    },
}
</script>

<template>
    <div class="InforPage">
        <van-tabs v-model:active="Index">
        <van-tab title="个人信息"><MyInfo_Mobile></MyInfo_Mobile></van-tab>
        <van-tab title="我的帖子"><MyPost_Mobile/></van-tab>
        <van-tab title="我的回复"><MyComment_Mobile></MyComment_Mobile></van-tab>
        <van-tab title="我的消息"><MyMessage_Mobile></MyMessage_Mobile></van-tab>
        </van-tabs>
    </div>
</template>

<style scoped>
.InforPage {
    width: 100%;
    height: 100%;
    padding-right: 2%;
    display: block;
}

</style>