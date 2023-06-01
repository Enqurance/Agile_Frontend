<template>
    <div
        style="
      padding-left: 10%;
      padding-top: 10%;
      background: rgb(246, 246, 246);
      width: 90%;
    "
    >
        <div style="width: 95%">
            <div style="margin-bottom: 3%; font-size: 20px">我的消息</div>
            <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                style="width: 90%"
            >
                <el-menu-item index="1" @click="Index = '1'">我收到的</el-menu-item>
                <div class="flex-grow"/>
                <el-menu-item index="2" @click="Index = '2'">我发起的</el-menu-item>
            </el-menu>
            <div v-if="this.Index === '1'">
                <el-button type="primary" @click="readAllRev()"> 全部已读</el-button>
                <el-button type="danger" @click="deleteRevDialog=true"> 全部删除</el-button>
                <el-dialog v-model="deleteRevDialog" center>
                    <div style="; text-align: center">
                        <el-text tag="b" style="color: black; font-size: 15px">
                            您确定删除所有消息吗？
                        </el-text>
                    </div>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button style="margin-left: 50%" @click="deleteRevDialog = false">取消</el-button>
                            <el-button type="primary" @click="delAllRev()">确认</el-button>
                        </div>
                    </template>
                </el-dialog>


                <el-scrollbar height="450px">
                    <div v-if="revs.length === 0">
                        <el-empty description="暂时还没有消息"/>
                    </div>
                    <div
                        v-for="rev in revs"
                        :key="rev.id"
                        style="
              border-radius: 20px;
              background: white;
              border: 2px solid rgb(246, 246, 246);
              width: 90%;
              height: 120px;
              margin-top: 10px;
            "
                    >
                        <el-icon style="float: right">
                            <circle-close @click="rev.deleteDialog = true"></circle-close>
                        </el-icon>
                        <div v-if="rev.read === false" style="float: right">
                            <el-icon>
                                <Warning/>
                            </el-icon>
                        </div>

                        <h3
                            style="
                padding: 0 20px;
                font-size: 18px;
                height: 50px;
                width: 80%;
                overflow: hidden;
              "
                            @click="clickMsg(rev)"
                        >
                            {{ rev.title }}
                        </h3>
                        <p
                            style="
                padding: 0 20px;
                font-size: 15px;
                height: 20px;
                width: 55%;
                overflow: hidden;
                display: inline-block;
              "
                        >
                            {{ rev.time }}
                        </p>

                        <el-button
                            v-if="rev.content"
                            style="float: right; display: inline-block"
                            type="primary"
                            size="small"
                            @click="readDetail(rev)"
                        >
                            查看详情
                        </el-button>
                        <el-dialog v-model="rev.detail" title="消息详情" width="80%" center>
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
                </el-scrollbar>
            </div>
            <div v-if="this.Index === '2'">
                <el-button type="primary" @click="readAllSnd()"> 全部已读</el-button>
                <el-button type="danger" @click="deleteSndDialog=true"> 全部删除</el-button>
                <el-dialog v-model="deleteSndDialog" center>
                    <div style="; text-align: center">
                        <el-text tag="b" style="color: black; font-size: 15px">
                            您确定删除所有消息吗？
                        </el-text>
                    </div>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button style="margin-left: 50%" @click="deleteSndDialog = false">取消</el-button>
                            <el-button type="primary" @click="delAllSnd()">确认</el-button>
                        </div>
                    </template>
                </el-dialog>

                <el-scrollbar height="450px">
                    <div v-if="snds.length === 0">
                        <el-empty description="暂时还没有消息"/>
                    </div>
                    <div
                        v-for="snd in snds"
                        :key="snd.id"
                        style="
              border-radius: 20px;
              background: white;
              border: 2px solid rgb(246, 246, 246);
              width: 90%;
              height: 120px;
            "
                    >
                        <el-icon style="float: right">
                            <circle-close @click="snd.deleteDialog = true"></circle-close>
                        </el-icon>
                        <div v-if="snd.read === false" style="float: right">
                            <el-icon>
                                <Warning/>
                            </el-icon>
                        </div>

                        <h3
                            style="
                padding: 0 20px;
                font-size: 18px;
                height: 50px;
                width: 80%;
                overflow: hidden;
              "
                            @click="clickMsg(snd)"
                        >
                            {{ snd.title }}
                        </h3>
                        <p
                            style="
                padding: 0 20px;
                font-size: 15px;
                height: 20px;
                width: 55%;
                overflow: hidden;
                display: inline-block;
              "
                        >
                            {{ snd.time }}
                        </p>
                        <el-button
                            v-if="snd.content"
                            style="float: right; display: inline-block"
                            type="primary"
                            size="small"
                            @click="readDetail(snd)"
                        >
                            查看详情
                        </el-button>
                        <el-dialog v-model="snd.detail" title="消息详情" width="80%" center>
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
                </el-scrollbar>
            </div>
        </div>
    </div>
    <el-row></el-row>
    <el-row></el-row>
    <el-row>
        <CopyrightICP/>
    </el-row>
</template>

<script>
import {CircleClose, Warning} from "@element-plus/icons-vue";
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
    name: "MyMessage_Mobile",
    components: {
        CircleClose,
        Warning,
        CopyrightICP
    },
    data() {
        return {
            Index: "1",
            activeIndex: "1",
            revs: [],
            snds: [],

            deleteRevDialog: false,
            deleteSndDialog: false
        };
    },
    methods: {
        clickMsg(msg) {
            this.readMsg(msg);
            if (msg.examine_id !== null && msg.examine_id !== 0) {
                this.$router.push("/Administrator");
            }
            else if (msg.post_id !== null && msg.post_id !== 0) {
                if (msg.floor_id !== null && msg.floor_id !== 0) {
                    this.$router.push({path: "/Forum/" + msg.post_id});
                }
                else {
                    this.$router.push({path: "/Forum/" + msg.post_id});
                }
            }
            // else {
            //   if (msg.content === null) {
            //     msg.content = msg.title;
            //   }
            //   msg.detail = true;
            // }
        },
        deleteMessage(msg) {
            let that = this;
            msg.deleteDialog = false;
            // console.log(msg);
            that.$axios
                .delete("/InfoPage/MyMessage/deleteMessage/" + msg.id, {
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    if (res.data.code === 200) {
                        // console.log("删除的帖子id为：" + msg.id)
                        this.$message({
                            type: "info",
                            message: "删除成功",
                        });
                        this.queryAllSnd();
                        this.queryAllRev();
                    }
                    else {
                        this.$message({
                            message: res.data.message,
                            type: "error",
                        });
                    }
                })
                .catch((res) => console.log(res));
        },
        readMsg(msg) {
            let that = this;
            // console.log(msg);
            that.$axios
                .post(
                    "/InfoPage/MyMessage/readMessageById",
                    {
                        m_id: msg.id,
                    },
                    {
                        headers: {
                            token: that.$cookies.get("user_token"),
                        },
                    }
                )
                .then((res) => {
                    //console.log(res)
                    if (res.data.code === 200) {
                        msg.read = true;
                        // console.log("read success")
                    }
                    else {
                        this.$message({
                            message: res.data.message,
                            type: "error",
                        });
                    }
                });
        },
        readDetail(msg) {
            // console.log(msg);
            msg.detail = true;
            msg.read = true;
        },
        queryAllRev() {
            let that = this;
            that.$axios
                .get("/InfoPage/MyMessage/getReceiveMessage", {
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    // console.log(res)
                    if (res.data.code === 200) {
                        // console.log("get rev success")
                        this.revs = res.data.data;
                    }
                    else {
                        this.$message({
                            message: res.data.message,
                            type: "error",
                        });
                    }
                });
        },
        queryAllSnd() {
            let that = this;
            that.$axios
                .get("/InfoPage/MyMessage/getSendMessage", {
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    // console.log(res)
                    if (res.data.code === 200) {
                        console.log("get snd success");
                        this.snds = res.data.data;
                    }
                    else {
                        this.$message({
                            message: res.data.message,
                            type: "error",
                        });
                    }
                });
        },

        readAllRev() {
            let that = this
            // console.log(that.$cookies.get('user_token'));
            that.$axios.post('/InfoPage/MyMessage/readAllReceiveMessage', {}, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    this.$message({
                        type: 'info',
                        message: '操作成功',
                    });
                    this.queryAllRev()
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))

        },
        delAllRev() {
            let that = this
            that.deleteRevDialog = false;
            // console.log(msg);
            that.$axios.post('/InfoPage/MyMessage/deleteAllReceiveMessage', {}, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    // console.log("删除的帖子id为：" + msg.id)
                    this.$message({
                        type: 'info',
                        message: '操作成功',
                    });
                    this.revs = [];
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))
        },
        readAllSnd() {
            let that = this
            // console.log(msg);
            that.$axios.post('/InfoPage/MyMessage/readAllSendMessage', {}, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    // console.log("删除的帖子id为：" + msg.id)
                    this.$message({
                        type: 'info',
                        message: '操作成功',
                    });
                    this.queryAllSnd();
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))

        },
        delAllSnd() {
            let that = this
            that.deleteSndDialog = false;
            // console.log(msg);
            that.$axios.post('/InfoPage/MyMessage/deleteAllSendMessage', {}, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    // console.log("删除的帖子id为：" + msg.id)
                    this.$message({
                        type: 'info',
                        message: '操作成功',
                    });
                    this.snds = [];
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))
        },
    },
    mounted() {
        this.queryAllRev();
        this.queryAllSnd();
    },
};
</script>

<style scoped>
.infinite-list {
    height: 360px;
    padding: 0;
    margin: 0;
    list-style: none;
}

.infinite-list .infinite-list-item {
    display: inline-block;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 0;
    color: var(--el-color-primary);
}
</style>