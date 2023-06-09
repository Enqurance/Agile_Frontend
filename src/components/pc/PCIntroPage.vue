<script>
import PageHeader from './PCPageHeader.vue'
import CopyrightICP from "@/components/CopyrightICP.vue";

import {
  User, Star, 
  Reading,
} from '@element-plus/icons-vue'

export default {
    name: "PCIntroPage",
    components: {
        CopyrightICP, PageHeader,
        User, Reading, Star, 
    },
    data() {
        return {
            isCollapse: false,
            Index: '1',
        }
    },
    computed: {
    },
    mounted() {
        this.Index = '1'
    },
    methods: {
    }
}
</script>

<template>
    <div style="height: 100%">
        <el-container style="height: 100%">
            <el-header style="padding-left: 0;padding-right: 0">
                <PageHeader/>
            </el-header>
            <el-container height="100%">
                <el-aside width="15%">
                    <el-menu
                        default-active="1"
                        :default-openeds="[]"
                        :collapse="isCollapse"
                        style="height: 100%">
                        <el-menu-item index="1" @click="Index='1'">
                            <el-icon><Reading /></el-icon>
                            <template #title>
                                <span>基本信息</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="2" @click="Index='2'">
                            <el-icon><Star /></el-icon>
                            <template #title>
                                <span>功能介紹</span>
                            </template>
                        </el-menu-item>
                        <el-sub-menu index="3">
                            <template #title>
                                <el-icon><User /></el-icon>
                                <span>成员介绍</span>
                            </template>
                            <el-menu-item index="3-1" @click="Index='3-1'">PM</el-menu-item>
                            <el-menu-item index="3-2" @click="Index='3-2'">前端</el-menu-item>
                            <el-menu-item index="3-3" @click="Index='3-3'">后端</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main height="100%" style="padding: 0px 0px 0px 0px;">

                    <!--基本信息部分 可直接将div縮起-->
                    <div v-if="this.Index.at(0) === '1'" style="height: 100%">
                        <el-container style="height: 100%;">
                        <el-header height="60%" class="header">
                            <view class="bg"><image class='back' src='@/assets/back.png'/></view>
                            <view class="co"></view>
                            <view class="up">
                                <p class="title">BUAAMapForum</p>
                                <p class="detail">from Group Agile-埃杰</p>
                            </view>
                        </el-header>
                        <el-card style="margin: 0%; height: 80%; padding-top: 5%;">
                            <div class="logo-container">
                                <p class="content">这里是Agile-埃杰软工小组,
                                            在应用中大家可以以Pin的形式浏览北航校园，也可以在论坛中进行咨询/分享，我们希望通过本应用为大家的大学生活提供便捷。</p>
                            </div>
                        </el-card>
                        </el-container>
                    </div>

                    <!--功能介紹部分-->
                    <div v-if="this.Index.at(0) === '2'" style="height: 100%">
                    </div>

                    <!--成員信息部分-->
                    <div v-if="this.Index === '3-1'" style="height: 100%;">
                        <el-row height="10%" style="padding: 2% 0px 0px 2%;  margin-bottom: 0px;">
                            <p style="padding-bottom: 0px; margin-bottom: 0px; font-size: 40px;">PM</p>
                        </el-row>
                        <el-row height="10%" style="padding: 2% 0px 2% 2%; border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro;">
                            <p style=" font-size: 17px; padding-left: 2%;">PM是团队的灵魂！</p>
                        </el-row>
                        <el-row :gutter="20" style="padding: 2% 0px 0px 3%;">
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-cow :span="12">
                                            <el-avatar
                                                :size="45"
                                                shape="circle"
                                                :src="this.imageUrl"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-cow>
                                            <el-cow :span="12" style=" padding-left: 8%; padding-top: 5%">
                                            <span style="font-size: 1.1em;">林子杰</span>
                                            </el-cow>
                                        </el-row>
                                    </template>
                                </el-card>
                            </div></el-col>
                        </el-row>
                    </div>
                    <div v-if="this.Index === '3-2'" style="height: 100%;">
                        <el-row height="10%" style="padding: 2% 0px 0px 2%;  margin-bottom: 0px;">
                            <p style="padding-bottom: 0px; margin-bottom: 0px; font-size: 40px;">FrontEnd</p>
                        </el-row>
                        <el-row height="10%" style="padding: 2% 0px 2% 2%; border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro;">
                            <p style=" font-size: 17px; padding-left: 2%;">前端是团队的窗口门户！</p>
                        </el-row>
                        <el-row :gutter="20" style="padding: 2% 0px 0px 3%;">
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-cow :span="12">
                                            <el-avatar
                                                :size="45"
                                                shape="circle"
                                                :src="this.imageUrl"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-cow>
                                            <el-cow :span="12" style=" padding-left: 8%; padding-top: 5%">
                                            <span style="font-size: 1.1em;">徐凯</span>
                                            </el-cow>
                                        </el-row>
                                    </template>
                                </el-card>
                            </div></el-col>
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-cow :span="12">
                                            <el-avatar
                                                :size="45"
                                                shape="circle"
                                                :src="this.imageUrl"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-cow>
                                            <el-cow :span="12" style=" padding-left: 8%; padding-top: 5%">
                                            <span style="font-size: 1.1em;">庞睿加</span>
                                            </el-cow>
                                        </el-row>
                                    </template>
                                </el-card>
                            </div></el-col>
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-cow :span="12">
                                            <el-avatar
                                                :size="45"
                                                shape="circle"
                                                :src="this.imageUrl"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-cow>
                                            <el-cow :span="12" style=" padding-left: 8%; padding-top: 5%">
                                            <span style="font-size: 1.1em;">秦铭悦</span>
                                            </el-cow>
                                        </el-row>
                                    </template>
                                </el-card>
                            </div></el-col>
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-cow :span="12">
                                            <el-avatar
                                                :size="45"
                                                shape="circle"
                                                :src="this.imageUrl"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-cow>
                                            <el-cow :span="12" style=" padding-left: 8%; padding-top: 5%">
                                            <span style="font-size: 1.1em;">吳湛宇</span>
                                            </el-cow>
                                        </el-row>
                                    </template>
                                </el-card>
                            </div></el-col>
                        </el-row>
                    </div>
                    <div v-if="this.Index === '3-3'" style="height: 100%;">
                        <el-row height="10%" style="padding: 2% 0px 0px 2%;  margin-bottom: 0px;">
                            <p style="padding-bottom: 0px; margin-bottom: 0px; font-size: 40px;">BackEnd</p>
                        </el-row>
                        <el-row height="10%" style="padding: 2% 0px 2% 2%; border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro;">
                            <p style=" font-size: 17px; padding-left: 2%;">后端是团队的坚实支撑！</p>
                        </el-row>
                        <el-row :gutter="20" style="padding: 2% 0px 0px 3%;">
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-cow :span="12">
                                            <el-avatar
                                                :size="45"
                                                shape="circle"
                                                :src="this.imageUrl"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-cow>
                                            <el-cow :span="12" style=" padding-left: 8%; padding-top: 5%">
                                            <span style="font-size: 1.1em;">李治圻</span>
                                            </el-cow>
                                        </el-row>
                                    </template>
                                </el-card>
                            </div></el-col>
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-cow :span="12">
                                            <el-avatar
                                                :size="45"
                                                shape="circle"
                                                :src="this.imageUrl"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-cow>
                                            <el-cow :span="12" style=" padding-left: 8%; padding-top: 5%">
                                            <span style="font-size: 1.1em;">杜维康</span>
                                            </el-cow>
                                        </el-row>
                                    </template>
                                </el-card>
                            </div></el-col>
                            <el-col :span="8"><div>
                            </div></el-col>
                        </el-row>
                    </div>
                </el-main>
            </el-container>
            <CopyrightICP></CopyrightICP>
        </el-container>
    </div>
</template>

<style scoped>
.title{
    font-family: fantasy;
    font-size: 3.2em;
    color: #164d78;
    text-align: center;
    padding-top: 11%;
    text-shadow: 0.4px 0.4px 0.8px rgb(12, 11, 105);
}
.detail{
    font-family: fantasy;
    font-size: 2.0em;
    color: #164d78;
    text-shadow: 0.4px 0.4px 0.8px rgb(12, 11, 105);
    text-align: center;
}
.logo-container {
    margin-left: 20%;
    width: 60%;
    height: 50%;
    background: rgba(255, 255, 255, 0);
    margin-top: 0px;
    margin-bottom: 0px;
    text-align: center;
}
.content{
    padding-top: 3%;
    font-size: 1.2em;
}
.header{
    width: 100%;
    align-self: center;
    padding: 0px 0px 0px 0px;
}
.up{
    width: 85%;
    height: 60%;
    position: relative;
}
.co{
    width: 85%;
    height: 60%;
    background-color: #b6c2cf;
    opacity: 0.15;
    background-size: cover;
    position: absolute;
}
.bg{
    width: 85%;
    height: 60%;
    position: absolute;
    background: url("@/assets/images/back.png");
    background-size: cover;
    opacity: 0.4
}
</style>