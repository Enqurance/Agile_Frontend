<template>
    <div style="margin: 0 auto;padding: 0 3%; width: 80%">
        <div class="sub_div" v-if="subMenu === 1">
            <div style="overflow: auto;">
                <el-empty v-if="revs.length === 0" class="empty_div" description="暂时还没有消息"/>
                <div v-else class="post_div" v-for="rev in revs" :key="rev.id" @click="readMsg(rev)">
                    <div>
                        <div v-if="rev.read===false" style="float: right; margin-top: -15px">
                            <el-icon color="blue" :size="20">
                                <Warning/>
                            </el-icon>
                        </div>
                        <el-popconfirm v-else title="您确定要删除这个消息吗？" confirm-button-text="确定" cancel-button-text="取消"
                                       confirm-button-type="warning" :hide-after="0" @confirm="deleteMessage(rev)">
                            <template #reference>
                                <el-icon color="red" :size="20" class="link_hover" style="float: right; margin-top: -15px">
                                    <circle-close />
                                </el-icon>
                            </template>
                        </el-popconfirm>

                        <div style="padding: 0 20px; overflow: hidden; margin: 0.83em 0">
                            <el-text style="font-size: 1.17em; color: black; font-weight: bolder">
                                {{ rev.title }}
                            </el-text>
                        </div>

                        <div v-if="rev.content" style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <el-text tag="b" size="large">消息详情:</el-text>
                            <el-text size="large">
                                {{ rev.content }}
                            </el-text>
                        </div>

                        <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <el-text tag="i" size="large">
                                {{ rev.time }}
                            </el-text>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="sub_div" v-if="subMenu === 2">
            <div style="overflow: auto">
                <div v-if="snds.length === 0">
                    <el-empty class="empty_div" description="暂时还没有消息"/>
                </div>
                <div v-else class="post_div" v-for="snd in snds" :key="snd.id" @click="readMsg(snd)" >
                    <div v-if="snd.read===false" style="float: right; margin-top: -2px">
                        <el-icon color="blue" :size="20">
                            <Warning/>
                        </el-icon>
                    </div>
                    <el-popconfirm v-else title="您确定要删除这个消息吗？" confirm-button-text="确定" cancel-button-text="取消"
                                   confirm-button-type="warning" :hide-after="0" @confirm="deleteMessage(snd)">
                        <template #reference>
                            <el-icon color="red" :size="20" class="link_hover" style="float: right; margin-top: -2px">
                                <circle-close/>
                            </el-icon>
                        </template>
                    </el-popconfirm>


                    <div style="padding: 0 20px;overflow: hidden; margin: 0.83em 0">
                        <el-text style="font-size: 1.17em; color: black; font-weight: bolder">
                            {{ snd.title }}
                        </el-text>
                    </div>

                    <div v-if="snd.content" style="padding: 0 10px 20px 20px;overflow: hidden;">
                        <el-text tag="b" size="large">消息详情:</el-text>
                        <el-text size="large">
                            {{ snd.content }}
                        </el-text>
                    </div>

                    <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                        <el-text tag="i" size="large">
                            {{ snd.time }}
                        </el-text>
                    </div>
                </div>
            </div>


        </div>

    </div>

</template>

<script>

import {CircleClose, Warning} from "@element-plus/icons-vue";

export default {
    name: "MyMessage",
    components: {CircleClose, Warning},
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
                console.log(res)
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
                console.log(res)
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

.empty_div {
    margin-top: 10%;
}

.post_div {
    margin: 20px 0;
    border-radius: 20px;
    background: white;
    border: 2px solid rgb(246, 246, 246);
    width: 98%;
}

.link_hover {
    cursor: pointer;
}

</style>