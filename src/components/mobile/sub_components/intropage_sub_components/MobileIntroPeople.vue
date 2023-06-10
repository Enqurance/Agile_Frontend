<script>
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
    name: "MobileIntroPeople",
    components: {
        CopyrightICP,
    },
    setup(){
        const onClickLeft = () => history.back();
        return {
        onClickLeft,
        }
    },
    data(){
        return{
            lzj: require('@/assets/images/lzj.png'),
            xk: require('@/assets/images/xk.png'),
            prj: require('@/assets/images/prj.png'),
            qmy: require('@/assets/images/qmy.png'),
            wzy: require('@/assets/images/wzy.png'),
            lzq: require('@/assets/images/lzq.png'),
            dwk: require('@/assets/images/dwk.png'),
        }
    }
}
</script>

<template>
    <div>
        <van-nav-bar
            title="成员信息"
            left-text=""
            left-arrow
            @click-left="onClickLeft"
        />
        <van-row height="10%" style="padding: 2% 0px 5% 8%; border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro;">
            <van-col span="8"><p style="padding-bottom: 0px; margin-bottom: 0px; font-size: 30px;">PM</p></van-col>
            <van-col span="16"><p style=" font-size: 15px; padding-top: 12%;">PM是团队的灵魂！</p></van-col>
        </van-row>
        <van-row style="padding: 10% 10% 0 10%;">
                <el-card style="width: 100%;">
                    <template #header>
                        <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                            <van-col :span="8" style="padding-left: 8%;">
                            <el-avatar
                                :size="45"
                                shape="circle"
                                :src="this.lzj"
                                style="user-select: none;">
                            </el-avatar>
                            </van-col>
                            <van-col :span="16" style=" padding-left: 10%; padding-top: 5%">
                            <span style="font-size: 1.1em">林子杰</span>
                            </van-col>
                        </van-row>
                    </template>
                    <van-row style="border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                        <span>
                        "你相信引力吗？人与人之间是有引力的，我已经相信这句话了"
                        </span>
                    </van-row>
                    <van-row style="padding:5% 5% 5% 5%;">
                        <span style="padding:0% 0% 3% 0%;">
                        主要贡献：
                        </span><span>
                        作为团队PM，同时参与了前端测试与美化
                        </span>
                    </van-row>
                    <van-row style="padding:5% 5% 4% 5%;">
                        <span>
                            联系方式：Enqurance@Outlook.com
                        </span>
                    </van-row>
                </el-card>
        </van-row>
        <van-row height="10%" style="padding: 2% 0px 5% 8%; border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro;">
            <van-col span="8"><p style="padding-bottom: 0px; margin-bottom: 0px; font-size: 30px;">前端</p></van-col>
            <van-col span="16"><p style=" font-size: 15px; padding-top: 12%;">前端是团队的门户窗口！</p></van-col>
        </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8" style="padding-left: 8%;">
                                <el-avatar
                                    :size="45"
                                    shape="circle"
                                    :src="this.xk"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 10%; padding-top: 5%">
                                <span style="font-size: 1.1em">徐凯</span>
                                </van-col>
                            </van-row>
                        </template>
                        <van-row style="border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                            <span>
                            "专业bug制造机~"
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 5% 5%;">
                            <span style="padding:0% 0% 3% 0%;">
                            主要贡献：
                            </span><span>
                            前端开发，参与了地图、管理员页面开发与前端美化
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 4% 5%;">
                        <span>
                            联系方式：20373398@buaa.edu.cn
                        </span>
                        </van-row>
                    </el-card>
            </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8" style="padding-left: 8%;">
                                <el-avatar
                                    :size="45"
                                    shape="circle"
                                    :src="this.prj"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 10%; padding-top: 5%">
                                <span style="font-size: 1.1em">庞睿加</span>
                                </van-col>
                            </van-row>
                        </template>
                        <van-row style="border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                            <span>
                            "代码跑起来我们再聊。"
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 5% 5%;">
                            <span style="padding:0% 0% 3% 0%;">
                            主要贡献：
                            </span><span>
                            前端开发，参与了个人、介绍页面开发与前端美化
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 4% 5%;">
                        <span>
                            联系方式：pangrj@buaa.edu.cn
                        </span>
                        </van-row>
                    </el-card>
            </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8" style="padding-left: 8%;">
                                <el-avatar
                                    :size="45"
                                    shape="circle"
                                    :src="this.qmy"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 10%; padding-top: 5%">
                                <span style="font-size: 1.1em">秦铭悦</span>
                                </van-col>
                            </van-row>
                        </template>
                        <van-row style="border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                            <span>
                                "头像是本人每天状态（真的没有夹带纸片人私货）"
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 5% 5%;">
                            <span style="padding:0% 0% 3% 0%;">
                            主要贡献：
                            </span><span>
                                前端开发，参与了地图、论坛页面开发与前端功能
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 4% 5%;">
                        <span>
                            联系方式：lune8777@gmail.com
                        </span>
                        </van-row>
                    </el-card>
            </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8" style="padding-left: 8%;">
                                <el-avatar
                                    :size="45"
                                    shape="circle"
                                    :src="this.wzy"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 10%; padding-top: 5%">
                                <span style="font-size: 1.1em">吴湛宇</span>
                                </van-col>
                            </van-row>
                        </template>
                        <van-row style="border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                            <span>
                                "不知道写点什么，干脆写点bug吧。bug↑↑bug ！"
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 5% 5%;">
                            <span style="padding:0% 0% 3% 0%;">
                            主要贡献：
                            </span><span>
                                前端开发，参与了信息页面开发与前端测试
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 4% 5%;">
                        <span>
                            联系方式：864294516@qq.com
                        </span>
                        </van-row>
                    </el-card>
            </van-row>
        <van-row height="10%" style="padding: 2% 0px 5% 8%; border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro;">
            <van-col span="8"><p style="padding-bottom: 0px; margin-bottom: 0px; font-size: 30px;">后端</p></van-col>
            <van-col span="16"><p style=" font-size: 15px; padding-top: 12%;">后端是团队的坚实支撑！</p></van-col>
        </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8" style="padding-left: 8%;">
                                <el-avatar
                                    :size="45"
                                    shape="circle"
                                    :src="this.lzq"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 10%; padding-top: 5%">
                                <span style="font-size: 1.1em">李治圻</span>
                                </van-col>
                            </van-row>
                        </template>
                        <van-row style="border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                            <span>
                                "渴望学好专业课，掌握多种技术，就是不知道有没有和头发达成共识┬＿┬"
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 5% 5%;">
                            <span style="padding:0% 0% 3% 0%;">
                            主要贡献：
                            </span><span>
                                后端开发，参与了接口实现与后端测试
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 4% 5%;">
                        <span>
                            联系方式：1437207980@qq.com
                        </span>
                        </van-row>
                    </el-card>
            </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8" style="padding-left: 8%;">
                                <el-avatar
                                    :size="45"
                                    shape="circle"
                                    :src="this.dwk"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 10%; padding-top: 5%">
                                <span style="font-size: 1.1em">杜维康</span>
                                </van-col>
                            </van-row>
                        </template>
                        <van-row style="border-bottom-width: thin;border-bottom-style: double;border-bottom-color: gainsboro; padding:5% 5% 10% 5%;">
                            <span>
                                "一个喜欢打篮球、看小说的 Bug 制造机 (((;꒪ꈊ꒪;)))"
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 5% 5%;">
                            <span style="padding:0% 0% 3% 0%;">
                            主要贡献：
                            </span><span>
                                后端开发，参与了接口实现与后端测试
                            </span>
                        </van-row>
                        <van-row style="padding:5% 5% 4% 5%;">
                        <span>
                            联系方式：sisyphusdu@gmail.com
                        </span>
                        </van-row>
                    </el-card>
            </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
            <div><CopyrightICP/></div>
            </van-row>
    </div>
</template>

<style scoped>
</style>