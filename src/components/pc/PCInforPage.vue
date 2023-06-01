<script>
import PageHeader from './PCPageHeader.vue'
import MyInfo from '@/components/pc/sub_components/infopage_sub_components/MyInfo.vue'
import MyComment from "@/components/pc/sub_components/infopage_sub_components/MyComment.vue";
import MyMessage from "@/components/pc/sub_components/infopage_sub_components/MyMessage.vue";
import MyPost from "@/components/pc/sub_components/infopage_sub_components/MyPost.vue";
import CopyrightICP from "@/components/CopyrightICP.vue";

import {
  User,
  Reading,
  ChatLineSquare,
  ChatRound, CircleCheck, CircleClose, Warning,
} from '@element-plus/icons-vue'

export default {
    name: "PCInfoPage",
    components: {
      Warning,
        PageHeader, User, Reading, ChatLineSquare, ChatRound,
        MyInfo, MyMessage, MyPost, MyComment, CopyrightICP
    },
    data() {
        return {
            isCollapse: false,
            Index: '1',
            hasUnread:false,
        }
    },
    computed: {
        sub_menu() {
            if (this.Index.length === 3) {
                return parseInt(this.Index.at(2))
            }
            else {
                return parseInt(this.Index)
            }
        }
    },
    mounted() {
        this.Index = '1'
        window.addEventListener('resize', this.handleResize)
        this.handleResize()

        this.checkUnread()

    },
    methods: {
        handleResize() {
            this.isCollapse = window.innerWidth < 768 // 在窗口宽度小于 768px 时折叠菜单
        },
        checkUnread()
        {
          let that=this;
          that.$axios.get('/InfoPage/MyMessage/checkUnreadMessage', {
            headers: {
              'token': that.$cookies.get('user_token')
            }

          }).then((res) => {
            if (res.data.code === 200) {
              // console.log("get rev success")
              this.hasUnread = res.data.data
            }
            else {
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          })
        }
    },
    watch: {
        sub_menu(newData) {
            // console.log(newData)
        }
    }
}
</script>

<template>
        <el-container style="height: 100%">
            <el-header style="padding-left: 0;padding-right: 0">
                <PageHeader/>
            </el-header>
            <el-container style="height: 80%">
                <el-aside width="15%">
                    <el-menu
                        default-active="1"
                        :default-openeds="[]"
                        :collapse="isCollapse"
                        style="height: 100%">
                        <el-menu-item index="1" @click="Index='1'">
                            <el-icon><User /></el-icon>
                            <template #title>
                                <span>个人信息</span>
                            </template>
                        </el-menu-item>
                        <el-sub-menu index="2">
                            <template #title>
                                <el-icon>
                                    <Reading />
                                </el-icon>
                                <span>我的帖子</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="2-1" @click="Index='2-1'">所有帖子</el-menu-item>
                                <el-menu-item index="2-2" @click="Index='2-2'">待整改帖子</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>
                        <el-sub-menu index="3">
                            <template #title>
                                <el-icon>
                                    <ChatLineSquare />
                                </el-icon>
                                <span>我的回复</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="3-1" @click="Index='3-1'">我的楼层</el-menu-item>
                                <el-menu-item index="3-2" @click="Index='3-2'">我的评论</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>
                        <el-sub-menu index="4">
                            <template #title>
                                <el-icon>
                                    <ChatRound />
                                </el-icon>
                                <span>我的消息</span>
                                <div v-if="this.hasUnread===true">
                                  <el-icon>
                                    <warning>

                                    </warning>
                                  </el-icon>
                                </div>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="4-1" @click="Index='4-1'">我收到的</el-menu-item>
                                <el-menu-item index="4-2" @click="Index='4-2'">我发起的</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
            <el-main style="height: 100%">
                <div v-if="this.Index.at(0) === '1'"><MyInfo></MyInfo></div>
                <div v-if="this.Index.at(0) === '2'"><MyPost :sub-menu="sub_menu" /></div>
                <div v-if="this.Index.at(0) === '3'"><MyComment :sub-menu="sub_menu" /></div>
                <div v-if="this.Index.at(0) === '4'"><MyMessage :sub-menu="sub_menu" /></div>
            </el-main>
        </el-container>
        <CopyrightICP/>
        </el-container>
</template>

<style scoped>
.MainPart{
    height: 92%;
}

</style>