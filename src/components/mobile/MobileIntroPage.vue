<script>
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
    name: "MobileIntroPage",
    components: {
        CopyrightICP,
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
        <!--基本信息部分 可直接講div縮起-->
        <van-row style="height: 35%" class="header">
            <view class="bg"><image class='back' src='@/assets/back.png'/></view>
            <view class="up">
                <p class="title">BUAAMapForum</p>
                <p class="detail">from Group Agile-埃杰</p>
            </view>
        </van-row>
        <van-row style="height: 30%">
            <div class="content-container">
                <p class="content">
                    在这里大家可以以Pin的形式浏览北航校园，也可以在论坛中进行咨询/分享，我们希望通过本应用为大家的大学生活提供便捷。</p>
            </div>
        </van-row>
        <van-row style="height: 15%; padding:0 20% 0 20%;">
            <van-cell title="功能介绍" is-link to="introFeat" />
            <van-cell title="成员信息" is-link to="introPeople" />
        </van-row>
        <van-row style="height: 10%;" ><CopyrightICP></CopyrightICP></van-row>
    </div>
</template>

<style scoped>
.title{
    font-family: fantasy;
    font-size: 2.2em;
    color: #164d78;
    text-align: center;
    padding-top: 10%;
}
.detail{
    font-family: fantasy;
    font-size: 1.5em;
    color: #164d78;
    text-align: center;
}
.content-container {
    margin-left: 15%;
    width: 75%;
    background: rgba(255, 255, 255, 0);
    margin-top: 0px;
    margin-bottom: 0px;
    text-align: center;
}
.content{
    padding-top: 10%;
    font-size: 1.0em;
}
.header{
    width: 100%;
    align-self: center;
    padding: 0px 0px 0px 0px;
}
.up{
    width: 100%;
    height: 35%;
    position: relative;
}
.bg{
    width: 100%;
    height: 35%;
    position: absolute;
    background: url("@/assets/images/backM.png");
    background-size: cover;
    opacity: 0.3
}
</style>