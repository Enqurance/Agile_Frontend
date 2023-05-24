<script>
import PageHeader from './PCPageHeader.vue'
import MyInfo from '@/components/pc/sub_components/infopage_sub_components/MyInfo.vue'
import MyComment from "@/components/pc/sub_components/infopage_sub_components/MyComment.vue";
import MyMessage from "@/components/pc/sub_components/infopage_sub_components/MyMessage.vue";
import MyPost from "@/components/pc/sub_components/infopage_sub_components/MyPost.vue";
import { ref } from 'vue'
import {
    User,
    Reading,
    ChatLineSquare,
    ChatRound,
} from '@element-plus/icons-vue'

export default {
    name: "PCInfoPage",
    components: { 
        PageHeader, User, Reading, ChatLineSquare, ChatRound, 
        MyInfo, MyMessage, MyPost, MyComment 
    },
    data() {
        return {
            isCollapse: false
        }
    },
    setup(){
        let Index = ref('1');
        return { Index }
    },
    mounted() {
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
    },
    methods: {
        handleResize() {
            this.isCollapse = window.innerWidth < 768 // 在窗口宽度小于 768px 时折叠菜单
        }
    },
}
</script>

<template>
    <div class="InforPage" style="height: 100%;width: 100%">
        <el-container style="height: 100%">
            <el-header>
                <PageHeader/>    
            </el-header>
            <el-container style="height: 80%">
                <el-aside width="15%">
                    <el-menu :default-active="Index" :collapse="isCollapse" style="height: 100%">
                        <el-menu-item index="1" @click="Index='1'">
                            <el-icon><User /></el-icon>
                            <template #title>
                                <span>个人信息</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="2" @click="Index='2'">
                            <el-icon><Reading /></el-icon>
                            <template #title>我的帖子</template>
                        </el-menu-item>
                        <el-menu-item index="3" @click="Index='3'">
                            <el-icon><ChatLineSquare /></el-icon>
                            <template #title>我的回复</template>
                        </el-menu-item>
                        <el-menu-item index="4" @click="Index='4'">
                            <el-icon><ChatRound /></el-icon>
                            <template #title>我的消息</template>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
            <el-main style="height: 100%">
                <div v-if="this.Index === '1'"><MyInfo></MyInfo></div>
                <div v-if="this.Index === '2'"><MyPost /></div>
                <div v-if="this.Index === '3'"><MyComment /></div>
                <div v-if="this.Index === '4'"><MyMessage /></div>
            </el-main>
        </el-container>
        </el-container>
    </div>
</template>

<style scoped>
.MainPart{
    height: 92%;
}

</style>