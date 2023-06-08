<script>
import PageHeader from './PCPageHeader.vue'
import CopyrightICP from "@/components/CopyrightICP.vue";

import {
  User,
  Reading,
} from '@element-plus/icons-vue'

export default {
    name: "PCIntroPage",
    components: {
        CopyrightICP, PageHeader,
        User, Reading, 
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
        {{ this.Index }}
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
                        <el-sub-menu index="2">
                            <template #title>
                                <el-icon><User /></el-icon>
                                <span>成员介绍</span>
                            </template>
                            <el-menu-item index="2-1" @click="Index='2-1'">PM</el-menu-item>
                            <el-menu-item index="2-2" @click="Index='2-2'">前端</el-menu-item>
                            <el-menu-item index="2-3" @click="Index='2-3'">后端</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main height="100%">
                    <div v-if="this.Index.at(0) === '1'" style="height: 100%">
                        <el-container style="height: 100%;">
                        <el-header height="30%" style="align-self: center; padding-top: 5%; padding-bottom: 8%;">
                            <p class="title">BUAAMapForum</p>
                        </el-header>
                        <el-card style="margin-left: 8%; margin-right: 8%;">
                        <el-container height="100%">
                            <el-aside width="50%" style="border-right-width: thin;border-right-style: double;border-right-color: gainsboro;">
                                    <div class="logo-container">
                                        <img src="/img/logo.png" alt="logo" style="width: 100%; height: auto;">
                                    </div>
                            </el-aside>
                            <el-main>
                                    <div class="logo-container">
                                        <p class="content">这里是Agile-埃杰软工小组,
                                            在应用中大家可以以Pin的形式浏览北航校园，也可以在论坛中进行咨询/分享，我们希望通过本应用为大家的大学生活提供便捷。</p>
                                    </div>
                            </el-main>
                        </el-container>
                        </el-card>
                        </el-container>
                    </div>
                    <div v-if="this.Index === '2-1'">
                        <el-row :gutter="20">
                            <el-col :span="8"><div>
                                <el-card>
                                    <template #header>
                                    <div class="card-header">
                                        <span>林子杰</span>
                                    </div>
                                    </template>
                                </el-card>
                            </div></el-col>
                        </el-row>
                    </div>
                    <div v-if="this.Index.at(0) === '2-2'">
                        <el-row :gutter="20">
                            <el-col :span="8"><div></div></el-col>
                            <el-col :span="8"><div></div></el-col>
                            <el-col :span="8"><div></div></el-col>
                        </el-row>
                    </div>
                    <div v-if="this.Index.at(0) === '2-3'">
                        <el-row :gutter="20">
                            <el-col :span="8"><div></div></el-col>
                            <el-col :span="8"><div></div></el-col>
                            <el-col :span="8"><div></div></el-col>
                        </el-row>
                    </div>
                    <div v-if="this.Index.at(0) === '3'">333</div>
                    <div v-if="this.Index.at(0) === '4'">444</div>
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
    color: #1f82ce;
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
    padding-top: 5%;
    font-family: fantasy;
    font-size: 1.3em;
}
</style>