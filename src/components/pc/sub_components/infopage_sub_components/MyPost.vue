<template>
    <div style="margin: 0 auto;padding: 0 3%; width: 80%">
        <div class="sub_div" v-if="this.subMenu === 1">
            <div style="overflow: auto">
                <div v-if="posts.length === 0">
                    <el-empty description="暂时还没有贴子"/>
                </div>

                <div v-else class="post_div" v-for="post in posts" :key="post.id">
                    <el-button style="float: right; margin-top: 20px;margin-right: 20px"
                               type="danger" @click="post.deleteDialog=true">
                        删除
                    </el-button>

                    <el-popover placement="top-start" :hide-after="0" trigger="hover"
                                content="点击跳转至帖子">
                        <template #reference>
                            <h3 class="link_hover" style="padding: 0 20px; width: 300px; height:28px;overflow: hidden"
                                @click="browsePost(post.id)">
                                {{ post.title }}
                            </h3>
                        </template>
                    </el-popover>

                    <div style="padding-left: 20px">
                        <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <el-text tag="b" size="large">内容: </el-text>
                            <el-text tag="i" size="large">
                                {{ post.content }}
                            </el-text>
                        </div>

                        <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <el-text tag="b" size="large">标签: </el-text>
                            <el-text size="large" :style="{color: _tag_to(post.tag).color}">
                                {{ _tag_to(post.tag).type }}
                            </el-text>
                        </div>

                        <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <el-text tag="b" size="large">关联钉子: </el-text>
                            <el-text size="large" >
                                {{ post.pin_id_str }}
                            </el-text>
                        </div>

                        <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <el-text tag="b" size="large">创建时间: </el-text>
                            <el-text tag="i" size="large">
                                {{ post.createTime }}
                            </el-text>
                        </div>

                        <div class="clearfix" style="padding: 0 10px 20px 20px;">
                            <div style="float: left; margin-right: 30px">
                                <el-icon>
                                    <ChatLineRound/>
                                </el-icon>
                                {{ post.floor_num }}
                            </div>
                            <div style="float: left; margin-right: 30px">
                                <span class="iconfont icon-dianzan" style="color: red" />
                                {{ post.thumbs_up }}
                            </div>
                            <div style="float: left">
                                <span class="iconfont icon-dianji" />
                                {{ post.visit }}
                            </div>
                        </div>
                    </div>

                    <el-dialog v-model="post.deleteDialog" title="删除帖子" width="30%" center>
                        <div style="; text-align: center">
                            <el-text tag="b" style="color: black; font-size: 15px">您确定要删除这个帖子吗？相关的评论也将被删除。</el-text>
                        </div>
                        <template #footer>
                            <div class="dialog-footer">
                                <el-button style="margin-left: 50%" @click="post.deleteDialog = false">取消</el-button>
                                <el-button type="primary" @click="deletePost(post)">确认</el-button>
                            </div>
                        </template>
                    </el-dialog>

                </div>
            </div>
        </div>


        <div class="sub_div" v-if="this.subMenu === 2">
            <div style="overflow: auto">
                <div v-if="bad_posts.length === 0">
                    <el-empty class="empty_div" description="没有待整改贴子"/>
                </div>

                <div v-else class="post_div" v-for="post in bad_posts" :key="post.id">
                    <el-button style="float: right; margin-top: 20px;margin-right: 20px" type="danger" @click="post.deleteDialog=true">
                        删除
                    </el-button>
                    <el-button style="float: right; margin-top: 20px;margin-right: 20px" type="primary" @click="editInfo(post)">
                        整改
                    </el-button>

                    <h3 class="link_hover" style="padding: 0 20px; width: 300px; height:28px;overflow: hidden"
                        @click="browsePost(post.id)">
                        {{ post.title }}
                    </h3>

                    <div style="padding-left: 20px">
                        <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <el-text tag="b" size="large">内容: </el-text>
                            <el-text tag="i" size="large">
                                {{ post.content }}
                            </el-text>
                        </div>

                        <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <el-text tag="b" size="large">标签: </el-text>
                            <el-text size="large" :style="{color: _tag_to(post.tag).color}">
                                {{ _tag_to(post.tag).type }}
                            </el-text>
                        </div>

                        <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <el-text tag="b" size="large">关联钉子: </el-text>
                            <el-text size="large" >
                                {{ post.pin_id_str }}
                            </el-text>
                        </div>

                        <div style="padding: 0 10px 10px 20px;overflow: hidden;">
                            <el-text tag="b" size="large">创建时间: </el-text>
                            <el-text tag="i" size="large">
                                {{ post.createTime }}
                            </el-text>
                        </div>
                    </div>

                    <div>
                        <div style="padding: 0 10px 20px 20px;overflow: hidden;">
                            <h4>整改原因: </h4>
                            <div>
                                <el-text style="padding-left: 20px" tag="i" size="large">
                                    {{ post.reason }}
                                </el-text>
                            </div>
                        </div>
                    </div>

                    <el-dialog v-model="post.changeDialog" title="整改帖子" width="30%" center>
                        <el-form>
                            <el-form-item label="标题">
                                <el-input v-model="post.new_title" autosize maxlength="60"></el-input>
                            </el-form-item>
                            <el-form-item label="正文">
                                <el-input v-model="post.new_content" type="textarea" :rows="6"
                                          maxlength="200"></el-input>
                            </el-form-item>
                        </el-form>

                        <template #footer>
                            <div class="dialog-footer">
                                <el-button style="margin-left: 50%" @click="post.changeDialog = false">取消</el-button>
                                <el-button type="primary" @click="changePost(post)">确认</el-button>
                            </div>
                        </template>
                    </el-dialog>

                    <el-dialog v-model="post.deleteDialog" title="删除帖子" width="30%" center>
                        <div style="; text-align: center">
                            <el-text tag="b" style="color: black; font-size: 15px">您确定要删除这个帖子吗？相关的评论也将被删除。</el-text>
                        </div>
                        <template #footer>
                            <div class="dialog-footer">
                                <el-button style="margin-left: 50%" @click="post.deleteDialog = false">取消</el-button>
                                <el-button type="primary" @click="deletePost(post)">确认</el-button>
                            </div>
                        </template>
                    </el-dialog>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ChatLineRound} from "@element-plus/icons-vue";
import '@/assets/PinIcon/font3/iconfont.css'
import global from "@/global";

export default {
    name: "MyPost",
    components: {ChatLineRound},
    props: {
        subMenu: Number
    },
    data() {
        return {
            posts: [],
            bad_posts: [],
            activeIndex: '1',
        }
    },
    methods: {
        _tag_to(tag) {
            let type = global.get_pin_type(tag)
            let color = global.get_pin_color(tag)

            return {
                type, color
            }
        },

        deletePost(post) {
            let that = this
            post.deleteDialog = false;
            // console.log(post);
            that.$axios.delete('/forum/post/deletePost/' + post.id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    // console.log("删除的帖子id为：" + post.id)
                    this.$message({
                        type: 'info',
                        message: '删除成功',
                    });
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))
        },
        editInfo(post) {
            post.changeDialog = true;
            post.new_title = post.title;
            post.new_content = post.content;
        },
        queryAllPost() {
            let that = this
            that.$axios.get('/InfoPage/MyPost/getMyAllPost', {
                headers: {
                    'token': that.$cookies.get('user_token')
                }

            }).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    // console.log("get post success")
                    this.posts = res.data.data
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            })
        },
        queryBadPost() {
            let that = this
            that.$axios.get('/InfoPage/MyPost/getMyBadPost', {
                headers: {
                    'token': that.$cookies.get('user_token')
                }

            }).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    // console.log("get bad post success")
                    this.bad_posts = res.data.data
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            })
        },
        browsePost(id) {
            // 记得改
            this.$router.push({path: '/Forum/' + id})
        },
        changePost(post) {
            post.changeDialog = false;
            let that = this
            that.$axios.post('/InfoPage/MyPost/changePostById', {
                post_id: post.id,
                new_title: post.new_title,
                new_content: post.new_content,
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    // console.log("change success")
                    this.$message({
                        message: "已提交整改，请耐心等待",
                        type: 'success'
                    })
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
        this.queryAllPost()
        this.queryBadPost()
    },
    watch: {
        subMenu(newData) {
            // console.log(newData)
        }
    }
}
</script>

<style scoped>
.infinite-list {
    height: 500px;
    list-style: none;
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
}

.clearfix::after {
    content: "";
    display: block;
    clear: both;
}

</style>