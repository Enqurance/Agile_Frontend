<script>
import PageHeader from './PCPageHeader.vue'
import PCIntro from './sub_components/PCIntro.vue';

import {
  User, Star, 
  Reading,
} from '@element-plus/icons-vue'

export default {
    name: "PCIntroPage",
    components: {
        PageHeader,
        User, Reading, Star, PCIntro
    },
    data() {
        return {
            isCollapse: false,
            Index: '1',

            lzj: require('@/assets/images/lzj.png'),
            xk: require('@/assets/images/xk.png'),
            prj: require('@/assets/images/prj.png'),
            qmy: require('@/assets/images/qmy.png'),
            wzy: require('@/assets/images/wzy.png'),
            lzq: require('@/assets/images/lzq.png'),
            dwk: require('@/assets/images/dwk.png'),
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
                <el-main height="100%" style="padding: 0px 5% 0px 0px;">

                    <!--基本信息部分 可直接将div縮起-->
                    <div v-if="this.Index.at(0) === '1'" style="height: 100%">
                        <el-container style="height: 100%;">
                        <el-header height="60%" class="header">
                            <view class="bg"></view>
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
                        <PCIntro/>
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
                                            <el-col :span="12">
                                            <el-avatar
                                                :size="50"
                                                shape="circle"
                                                :src="this.lzj"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-col>
                                            <el-col :span="12" style=" padding-left: 3%; padding-top: 10%">
                                            <span style="font-size: 1.2em;">林子杰</span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <el-row style="border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                                        <span style="font-size: 1.1em;">
                                        "你相信引力吗？人与人之间是有引力的，我已经相信这句话了"
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 5% 5%;"><span style="padding:0% 0% 5% 0%; font-size: 1.1em;">
                                        主要贡献：
                                    </span><span style="font-size: 1.1em;">
                                        作为团队PM，同时参与了前端测试与美化
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 3% 5%;"><span style="font-size: 1.1em;">
                                        联系方式：Enqurance@Outlook.com
                                    </span></el-row>
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
                                            <el-col :span="12">
                                            <el-avatar
                                                :size="50"
                                                shape="circle"
                                                :src="this.xk"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-col>
                                            <el-col :span="12" style=" padding-left: 3%; padding-top: 10%">
                                            <span style="font-size: 1.2em;">徐凯</span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <el-row style="height: 15%; border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 18% 5%;">
                                        <span style="font-size: 1.1em;">
                                        "专业bug制造机~"
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 5% 5%;"><span style="padding:0% 0% 8% 0%; font-size: 1.1em;">
                                        主要贡献：
                                    </span><span style="font-size: 1.1em;">
                                        前端开发，参与地图、管理员页面开发与前端美化
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 3% 5%;"><span style="font-size: 1.1em;">
                                        联系方式：20373398@buaa.edu.cn
                                    </span></el-row>
                                </el-card>
                            </div></el-col>
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-col :span="12">
                                            <el-avatar
                                                :size="50"
                                                shape="circle"
                                                :src="this.prj"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-col>
                                            <el-col :span="12" style=" padding-left: 3%; padding-top: 10%">
                                            <span style="font-size: 1.2em;">庞睿加</span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <el-row style="height: 15%;  border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 18% 5%;">
                                        <span style="font-size: 1.1em;">
                                        "代码跑起来我们再聊。"
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 5% 5%;"><span style="padding:0% 0% 8% 0%; font-size: 1.1em;">
                                        主要贡献：
                                    </span><span style="font-size: 1.1em;">
                                        前端开发，参与了个人、介绍页面开发与前端美化
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 3% 5%;"><span style="font-size: 1.1em;">
                                        联系方式：pangrj@buaa.edu.cn
                                    </span></el-row>
                                </el-card>
                            </div></el-col>
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-col :span="12">
                                            <el-avatar
                                                :size="50"
                                                shape="circle"
                                                :src="this.qmy"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-col>
                                            <el-col :span="12" style=" padding-left: 3%; padding-top: 10%">
                                            <span style="font-size: 1.2em;">秦铭悦</span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <el-row style="height: 15%;  border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                                        <span style="font-size: 1.1em;">
                                        "头像是本人每天状态（真的没有夹带纸片人私货）"
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 5% 5%;"><span style="padding:0% 0% 8% 0%; font-size: 1.1em;">
                                        主要贡献：
                                    </span><span style="font-size: 1.1em;">
                                        前端开发，参与了地图、论坛页面开发与前端功能
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 3% 5%;"><span style="font-size: 1.1em;">
                                        联系方式：lune8777@gmail.com
                                    </span></el-row>
                                </el-card>
                            </div></el-col>
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-col :span="12">
                                            <el-avatar
                                                :size="50"
                                                shape="circle"
                                                :src="this.wzy"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-col>
                                            <el-col :span="12" style=" padding-left: 3%; padding-top: 10%">
                                            <span style="font-size: 1.2em;">吴湛宇</span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <el-row style="height: 15%;  border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                                        <span style="font-size: 1.1em;">
                                        "不知道写点什么，干脆写点bug吧。bug↑↑bug ！"
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 5% 5%;"><span style="padding:0% 0% 8% 0%; font-size: 1.1em;">
                                        主要贡献：
                                    </span><span style="font-size: 1.1em;">
                                        前端开发，参与了信息页面开发与前端测试
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 3% 5%;"><span style="font-size: 1.1em;">
                                        联系方式：864294516@qq.com
                                    </span></el-row>
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
                                            <el-col :span="12">
                                            <el-avatar
                                                :size="50"
                                                shape="circle"
                                                :src="this.lzq"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-col>
                                            <el-col :span="12" style=" padding-left: 3%; padding-top: 10%">
                                            <span style="font-size: 1.2em;">李治圻</span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <el-row style="height: 15%;  border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                                        <span style="font-size: 1.1em;">
                                        "渴望学好专业课，掌握多种技术，就是不知道有没有和头发达成共识┬＿┬"
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 5% 5%;"><span style="padding:0% 0% 5% 0%; font-size: 1.1em;">
                                        主要贡献：
                                    </span><span style="font-size: 1.1em;">
                                        后端开发，参与了接口实现与后端测试
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 3% 5%;"><span style="font-size: 1.1em;">
                                        联系方式：1437207980@qq.com
                                    </span></el-row>
                                </el-card>
                            </div></el-col>
                            <el-col :span="6"><div>
                                <el-card>
                                    <template #header>
                                        <el-row :gutter="20" style="width: 100%; margin: 0px 0px 0px 0px;">
                                            <el-col :span="12">
                                            <el-avatar
                                                :size="50"
                                                shape="circle"
                                                :src="this.dwk"
                                                style="user-select: none;">
                                            </el-avatar>
                                            </el-col>
                                            <el-col :span="12" style=" padding-left: 3%; padding-top: 10%">
                                            <span style="font-size: 1.2em;">杜维康</span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <el-row style="height: 15%;  border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 18% 5%;">
                                        <span style="font-size: 1.1em;">
                                        "一个喜欢打篮球、看小说的 Bug 制造机 (((;꒪ꈊ꒪;)))"
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 5% 5%;"><span style="padding:0% 0% 5% 0%; font-size: 1.1em;">
                                        主要贡献：
                                    </span><span style="font-size: 1.1em;">
                                        后端开发，参与了接口实现与后端测试
                                    </span></el-row>
                                    <el-row style="padding:5% 5% 3% 5%;"><span style="font-size: 1.1em;">
                                        联系方式：sisyphusdu@gmail.com
                                    </span></el-row>
                                </el-card>
                            </div></el-col>
                            <el-col :span="8"><div>
                            </div></el-col>
                        </el-row>
                    </div>
                </el-main>
            </el-container>
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