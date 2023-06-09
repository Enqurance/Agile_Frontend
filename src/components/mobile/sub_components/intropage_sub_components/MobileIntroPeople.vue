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
                            <van-col :span="8">
                            <el-avatar
                                :size="40"
                                shape="circle"
                                :src="this.imageUrl"
                                style="user-select: none;">
                            </el-avatar>
                            </van-col>
                            <van-col :span="16" style=" padding-left: 5%; padding-top: 5%">
                            <span>林子杰</span>
                            </van-col>
                        </van-row>
                    </template>
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
                                <van-col :span="8">
                                <el-avatar
                                    :size="40"
                                    shape="circle"
                                    :src="this.imageUrl"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 5%; padding-top: 5%">
                                <span>徐凯</span>
                                </van-col>
                            </van-row>
                        </template>
                    </el-card>
            </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8">
                                <el-avatar
                                    :size="40"
                                    shape="circle"
                                    :src="this.imageUrl"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 5%; padding-top: 5%">
                                <span>庞睿加</span>
                                </van-col>
                            </van-row>
                        </template>
                    </el-card>
            </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8">
                                <el-avatar
                                    :size="40"
                                    shape="circle"
                                    :src="this.imageUrl"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 5%; padding-top: 5%">
                                <span>秦铭悦</span>
                                </van-col>
                            </van-row>
                        </template>
                    </el-card>
            </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8">
                                <el-avatar
                                    :size="40"
                                    shape="circle"
                                    :src="this.imageUrl"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 5%; padding-top: 5%">
                                <span>吴湛宇</span>
                                </van-col>
                            </van-row>
                        </template>
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
                                <van-col :span="8">
                                <el-avatar
                                    :size="40"
                                    shape="circle"
                                    :src="this.imageUrl"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 5%; padding-top: 5%">
                                <span>李治圻</span>
                                </van-col>
                            </van-row>
                        </template>
                    </el-card>
            </van-row>
            <van-row style="padding: 10% 10% 0 10%;">
                    <el-card style="width: 100%;">
                        <template #header>
                            <van-row style="width: 100%; margin: 0px 0px 0px 0px;">
                                <van-col :span="8">
                                <el-avatar
                                    :size="40"
                                    shape="circle"
                                    :src="this.imageUrl"
                                    style="user-select: none;">
                                </el-avatar>
                                </van-col>
                                <van-col :span="16" style=" padding-left: 5%; padding-top: 5%">
                                <span>杜维康</span>
                                </van-col>
                            </van-row>
                        </template>
                    </el-card>
            </van-row>
            <van-row><CopyrightICP></CopyrightICP></van-row>
    </div>
</template>

<style scoped>
</style>