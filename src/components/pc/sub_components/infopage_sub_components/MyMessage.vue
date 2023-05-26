<template>
    <div style="margin: 0 auto;padding: 0 3%; width: 80%">
        <div class="sub_div" v-if="subMenu === 1">
            <div style="overflow: auto;">
                <el-empty v-if="revs.length === 0" class="empty_div" description="暂时还没有消息"/>
                <div v-else class="post_div" v-for="rev in revs" :key="rev.id">
                    <el-icon style="float: right">
                        <circle-close @click="rev.deleteDialog=true">

                        </circle-close>
                    </el-icon>
                    <div v-if="rev.read===false" style="float: right;padding-top: 50px">
                        <el-icon>
                            <Warning/>
                        </el-icon>
                    </div>
                    <el-dialog v-model="rev.deleteDialog" title="删除消息" width="30%" center>
            <span style="text-align: center">
              你确定要删除这个消息吗？
            </span>
                        <template #footer>
            <span class="dialog-footer">
              <el-button @click="rev.deleteDialog = false">取消</el-button>
              <el-button type="primary" @click="deleteMessage(rev)">
                确认
              </el-button>
            </span>
                        </template>
                    </el-dialog>

                    <h3 style="padding: 0 20px;font-size:18px;height:50px;width:80%;overflow: hidden;"
                        @click="clickMsg(rev)">
                        {{ rev.title }}
                    </h3>
                    <p style="padding: 0 20px;font-size:16px;height:20px;width:70%;overflow: hidden;display: inline-block">
                        {{ rev.time }}
                    </p>
                    <el-button v-if="rev.content" style="float: right;" @click="readDetail(rev)">
                        查看详情
                    </el-button>
                    <el-dialog v-model="rev.detail" title="消息详情" width="30%" center>
            <span style="text-align: center">
              {{ rev.content }}
            </span>

                        <template #footer>
              <span class="dialog-footer">
                <el-button @click="rev.detail = false">关闭</el-button>
              </span>
                        </template>
                    </el-dialog>
                </div>
            </div>
        </div>

        <div class="sub_div" v-if="subMenu === 2">
            <div style="overflow: auto">
                <div v-if="snds.length === 0">
                    <el-empty class="empty_div" description="暂时还没有消息"/>
                </div>
                <div v-else class="post_div" v-for="snd in snds" :key="snd.id">
                    <el-icon style="float: right">
                        <circle-close @click="snd.deleteDialog=true">

                        </circle-close>
                    </el-icon>
                    <div v-if="snd.read===false" style="float: right;padding-top: 50px">
                        <el-icon>
                            <Opportunity></Opportunity>
                        </el-icon>
                    </div>
                    <el-dialog v-model="snd.deleteDialog" title="删除消息" width="30%" center>
            <span style="text-align: center">
              你确定要删除这个消息吗？
            </span>
                        <template #footer>
            <span class="dialog-footer">
              <el-button @click="snd.deleteDialog = false">取消</el-button>
              <el-button type="primary" @click="deleteMessage(snd)">
                确认
              </el-button>
            </span>
                        </template>
                    </el-dialog>

                    <h3 style="padding: 0 20px;font-size:18px;height:50px;width:80%;overflow: hidden;"
                        @click="clickMsg(snd)">
                        {{ snd.title }}
                    </h3>
                    <p style="padding: 0 20px;font-size:16px;height:20px;width:70%;overflow: hidden;display: inline-block">
                        {{ snd.time }}
                    </p>
                    <el-button v-if="snd.content" style="float: right;" @click="readDetail(snd)">
                        查看详情
                    </el-button>
                    <el-dialog v-model="snd.detail" title="消息详情" width="30%" center>
            <span style="text-align: center">
              {{ snd.content }}
            </span>

                        <template #footer>
              <span class="dialog-footer">
                <el-button @click="snd.detail = false">关闭</el-button>
              </span>
                        </template>
                    </el-dialog>
                </div>
            </div>


        </div>

    </div>

</template>

<script>

import {CircleClose, Opportunity, Warning} from "@element-plus/icons-vue";

export default {
    name: "MyMessage",
    components: {Opportunity, CircleClose, Warning},
    props: {
        subMenu: Number
    },
    data() {
        return {
            revs: [],
            snds: [],
        }
    },
    methods: {
        clickMsg(msg) {
            this.readMsg(msg);
            if (msg.examine_id !== null && msg.examine_id !== 0) {
                this.$router.push('/Administrator');
            }
            else if (msg.post_id !== null && msg.post_id !== 0) {
                if (msg.floor_id !== null && msg.floor_id !== 0) {
                    this.$router.push({path: '/Forum/' + msg.post_id});
                }
                else {
                    this.$router.push({path: '/Forum/' + msg.post_id});
                }
            }
            // else {
            //   if (msg.content === null) {
            //     // msg.content = msg.title;
            //   }
            //   msg.detail = true;
            // }
        },
        readDetail(msg) {
            // console.log(msg);
            msg.detail = true;
            msg.read = true;
        },
        readMsg(msg) {
            let that = this;
            // console.log(msg);
            that.$axios.post('/InfoPage/MyMessage/readMessageById', {
                m_id: msg.id
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                //console.log(res)
                if (res.data.code === 200) {
                    msg.read = true;
                    // console.log("read success")
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            })
        },
        deleteMessage(msg) {
            let that = this
            msg.deleteDialog = false;
            // console.log(msg);
            that.$axios.delete('/InfoPage/MyMessage/deleteMessage/' + msg.id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    // console.log("删除的帖子id为：" + msg.id)
                    this.$message({
                        type: 'info',
                        message: '删除成功',
                    });
                    this.queryAllSnd();
                    this.queryAllRev();
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))
        },
        queryAllRev() {
            let that = this
            that.$axios.get('/InfoPage/MyMessage/getReceiveMessage', {
                headers: {
                    'token': that.$cookies.get('user_token')
                }

            }).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    // console.log("get rev success")
                    this.revs = res.data.data
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            })
        },
        queryAllSnd() {
            let that = this
            that.$axios.get('/InfoPage/MyMessage/getSendMessage', {
                headers: {
                    'token': that.$cookies.get('user_token')
                }

            }).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    // console.log("get snd success")
                    this.snds = res.data.data
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            })
        },
    },
    mounted() {
        this.queryAllRev();
        this.queryAllSnd();

    }
}
</script>

<style scoped>

.infinite-list .infinite-list-item {
    display: inline-block;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 30px;
    color: var(--el-color-primary);
}

.sub_div {

}

.empty_div {
    margin-top: 10%;
}

.post_div {
    margin: 20px 0;
    border-radius: 20px;
    background: white;
    border: 2px solid rgb(246, 246, 246);
    width: 98%;
    height: 150px
}

</style>