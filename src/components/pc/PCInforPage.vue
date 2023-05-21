<script>
import PageHeader from './PCPageHeader.vue'
import MyInfo from '@/components/pc/sub_components/infopage_sub_components/MyInfo.vue'
import MyComment from "@/components/pc/sub_components/infopage_sub_components/MyComment.vue";
import MyMessage from "@/components/pc/sub_components/infopage_sub_components/MyMessage.vue";
import MyPost from "@/components/pc/sub_components/infopage_sub_components/MyPost.vue";
import { ref, reactive } from 'vue'
import {
  User,
  Reading,
  ChatLineSquare,
  ChatRound,
} from '@element-plus/icons-vue'

export default {
    name: "PCInfoPage",
    components: { PageHeader, User, Reading, ChatLineSquare, ChatRound, MyInfo, MyMessage, MyPost, MyComment },
    setup(){
        const isCollapse = ref(true);
        let Index = ref('1');
        return {isCollapse, Index,}
    },
    methods: {

    },
}
</script>

<template>
    <div class="InforPage">
        <div class="header">
            <PageHeader style="position: fixed; top: 0; width: 100%; z-index: 3; background: black; opacity: 0.8" />
        </div>
        <el-container class="MainPart">
        <el-aside width="5%" v-if="this.isCollapse">
            <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">省略</el-radio-button>
            </el-radio-group>
            <el-menu
                :default-active="Index"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
            >
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
        <el-aside width="10%" v-else>
            <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">省略</el-radio-button>
            </el-radio-group>
            <el-menu
                :default-active="Index"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
            >
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
        <el-main>
            <div v-if="this.Index === '1'"><MyInfo></MyInfo></div>
            <div v-if="this.Index === '2'"><MyPost /></div>
            <div v-if="this.Index === '3'"><MyComment /></div>
            <div v-if="this.Index === '4'"><MyMessage /></div>
        </el-main>
        </el-container>
    </div>
</template>

<style scoped>
.InforPage {
    width: 100%;
    height: 100%;
    padding-right: 2%;
    display: block;
}
.header {
    height: 8%;
    display: block;
}
.MainPart{
    height: 92%;
}

</style>