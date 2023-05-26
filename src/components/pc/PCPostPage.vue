<template>
    <el-container>
        <el-header>
            <PageHeader style="position: fixed; top: 0; width: 100%; z-index: 3; background: black; opacity: 0.3" />
        </el-header>
        <el-main>
            <div class="main">
                <div class="left"></div>

                <div class="center">
                    <div class="post_header">
                        <span class="post_title">标题：{{ post.title }}</span>
                        <el-button v-if="post.is_auth" type="danger" @click="showDeletePost">删除post</el-button>
                        <el-button type="danger" @click="showReportPostPrompt">举报post</el-button>
                        <el-button v-if="post.is_auth" @click="editPost">编辑post</el-button>
                    </div>
                    <div class="post_body">内容：{{ post.content }}</div>
                    <div class="post_body">点赞数：{{ post.thumbsUp }}</div>
                    <el-button @click="addLike">点赞</el-button> 
                    <!-- 这里会替换成图标，根据post.has_thumb来分辨 -->
                    <div>
                        <el-dialog v-model="postDialogVisible">
                            <div>
                                <el-form>
                                    <el-form-item label="标题">
                                        <el-input v-model="formPost.title" autosize maxlength="60"></el-input>
                                    </el-form-item>
                                    <el-form-item label="正文">
                                        <el-input v-model="formPost.content" type="textarea" :rows="6"
                                            maxlength="200"></el-input>
                                    </el-form-item>
                                    <el-form-item label="类别">
                                        <el-radio-group v-model="formPost.tag">
                                            <el-radio :label="1">餐饮</el-radio>
                                            <el-radio :label="2">园地</el-radio>
                                            <el-radio :label="3">教学</el-radio>
                                            <el-radio :label="4">体育</el-radio>
                                            <el-radio :label="5">办公</el-radio>
                                            <el-radio :label="6">购物</el-radio>
                                            <el-radio :label="7">生活服务</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <!-- <el-form-item label="关联钉子">
                                    </el-form-item> -->
                                </el-form>
                                <el-button type="primary" @click="submitEditForm">确认</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <div class="post_footer">
                        <div class="avatar">
                            <img :src="this.imageUrl" alt="avatar" class="avatar-img">
                        </div>
                        <el-button class="post_reply-btn" @click="newFloorDialogVisible = true">回复帖子</el-button>
                        <el-dialog v-model="newFloorDialogVisible">
                            <el-form :model="newFloorForm" ref="newFloorForm" label-width="80px">
                                <el-form-item label="评论内容">
                                    <el-input v-model="newFloorForm.body" type="textarea"></el-input>
                                </el-form-item>
                            </el-form>
                            <div>
                                <el-button type="primary" @click="addNewFloor">提交</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <div class="post_floors">
                        <div class="post_floor" v-for="(floor, index) in floors" :key="index">
                            <div class="post_floor-header">(用户id){{ floor.userid }} 发表于 {{ floor.createTime }}</div>
                            <div class="post_floor-body">{{ floor.content }}</div>

                            <el-button v-if="floor.is_auth" type="danger"
                                @click="showDeleteFloor(floor.id)">删除floor</el-button>
                            <el-button type="danger" @click="showReportReplyPrompt(0, floor.id)">举报floor</el-button>
                            <div v-if="floor.comment_cases">第一条comment ：{{ floor.comment_cases.content }}</div>
                            <div class="post_floor-footer">
                                <el-button class="post_floor-reply-btn"
                                    @click="loadAllComments(floor.id)">查看全部评论</el-button>
                            </div>

                            <el-dialog v-model="commentsDialogVisible" title="全部评论" width="50%">
                                <div class="post_floor-comments" v-for="comment in comments" :key="comment.id">
                                    <el-button v-if="comment.is_auth" type="danger"
                                        @click="showDeleteComment(comment.id, floor.id)">删除comment</el-button>
                                    <el-button type="danger"
                                        @click="showReportReplyPrompt(1, comment.id)">举报comment</el-button>
                                    <div class="post_floor-comment-header">作者 评论于 {{ comment.createTime }}</div>
                                    <div class="post_floor-comment-body">内容：{{ comment.content }}</div>
                                </div>
                                <el-form>
                                    <el-form-item>
                                        <el-input v-model="newCommentBody" type="textarea"></el-input>
                                    </el-form-item>
                                </el-form>
                                <div>
                                    <el-button type="primary" @click="addComment(floor.id)">提交评论</el-button>
                                </div>
                            </el-dialog>
                        </div>
                        <el-pagination v-if="totalFloors > 0" @current-change="handlePageChange" v-model="currentPage"
                            :page-size="limit" :total="totalFloors">
                        </el-pagination>
                    </div>
                </div>

                <div class="right"></div>
            </div>
        </el-main>
    </el-container>
</template>


<script>
import { ref, onMounted, getCurrentInstance } from 'vue'
import PageHeader from "@/components/pc/PCPageHeader.vue";

export default {
    name: "PCPostpage",

    components: {
        PageHeader,
    },

    data() {
        return {
            post: {},

            postDialogVisible: false,
            formPost: {

            },

            newFloorDialogVisible: false,
            newFloorForm: {
                body: ''
            },

            commentsDialogVisible: false,
            newCommentBody: '',

            comments: [],
        };
    },

    setup() {
        const currentPage = ref(1);
        const totalFloors = ref(0);

        const { proxy } = getCurrentInstance();
        const imageUrl = ref('');
        const floors = ref([]);
        const offset = ref(0);
        const limit = 5;

        const id = proxy.$route.params.postID;

        const loadFloors = (offset) => {
            proxy.$axios.post('/forum/floor/getFloors', null, {
                params: {
                    post_id: id,
                    offset: parseInt(offset.value),
                    limit: parseInt(limit)
                },
                headers: {
                    'token': proxy.$cookies.get('user_token')
                }
            }).then((res) => {
                //console.log(res)
                if (res.data.code == 200) {
                    floors.value = res.data.data.retFloors;
                    totalFloors.value = res.data.data.length;
                    //console.log(res.data.data.retFloors)
                } else {
                    floors.value = []
                    totalFloors.value = 0;
                }
            }).catch((error) => {
                console.log(error);
            });
        };

        const handlePageChange = (currentPage) => {
            offset.value = (currentPage - 1) * limit;
            loadFloors(offset);
        };

        onMounted(() => {
            loadFloors(offset);
        });


        return {
            imageUrl, floors, currentPage, totalFloors, limit,
            handlePageChange, loadFloors
        };
    },

    methods: {
        tokenCheck() {
            if (!this.$cookies.get('user_token')) {
                this.$message({
                    message: '请先登录!',
                    type: "warning"
                })
                this.$router.push({ path: '/login' })
            }
        },

        initPost() {
            console.log("init")
            this.getIcon()
            this.getPostDetail()
        },

        getIcon() {
            let that = this;
            that.$axios.get('user/getIcon',
                {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    },
                }).then((res) => {
                    this.imageUrl = res.data.data;
                }).catch((res) => console.log(res))

            this.refreshIcon();
        },
        refreshIcon() {
            this.isReload = false;
            this.$nextTick(() => {
                this.isReload = true;
            })
        },


        getPostDetail() {
            let that = this;
            let id = that.$route.params.postID;
            that.$axios.post('/forum/post/getPostDetail', null, {
                params: {
                    post_id: id,
                },
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                that.post = res.data.data
                //console.log(res)
            }).catch((error) => {
                console.log(error);
            });
            this.refreshPostDetail();
        },
        refreshPostDetail() {
            this.isReload = false;
            this.$nextTick(() => {
                this.isReload = true;
            })
        },





        addNewFloor() {
            this.tokenCheck()
            if (this.newFloorForm.content === '') {
                return this.$message.error("楼层正文不能为空")
            }

            let that = this
            that.$axios.post('/forum/floor/addFloor', null, {
                params: {
                    post_id: that.post.id,
                    floor_content: that.newFloorForm.body,
                },
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((response) => {
                //console.log(response)
                that.newFloorForm.body = ''
                if (response.data.code == 200) {
                    that.loadFloors(ref(0))
                }
            })
            this.newFloorDialogVisible = false
        },


        loadAllComments(floorID) {
            let that = this
            that.$axios.post('/forum/comment/getComments', null, {
                params: {
                    floor_id: floorID,
                    offset: 0,
                    limit: 2147483647  //全加载
                },
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                //console.log(res.data)
                if (res.data.code == 200) {
                    that.comments = res.data.data.retComments
                    //console.log(res.data.data.retComments)
                } else {
                    that.comments = []
                }
                that.commentsDialogVisible = true
            }).catch((error) => {
                console.log(error);
            });
        },

        addComment(floorID) {
            this.tokenCheck()
            if (this.newCommentBody === '') {
                return this.$message.error("评论不能为空")
            }

            let that = this
            that.$axios.post('/forum/comment/addComment', null, {
                params: {
                    c_content: that.newCommentBody,
                    floor_id: floorID,
                    rcomment_id: 0
                },
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((response) => {
                //console.log(response)
                that.newCommentBody = ''
                if (response.data.code === 200) {
                    that.loadAllComments(floorID)
                }
            })
        },

        showDeletePost() {
            this.tokenCheck()
            this.$confirm(
                '确认删除该post？',
                'Warning',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                this.deletePost();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除',
                });
            });
        },
        deletePost() {
            let that = this

            that.$axios.delete('/forum/post/deletePost/' + that.post.id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    console.log("删除的帖子id为：" + that.post.id)
                    this.$message({
                        type: 'info',
                        message: '删除成功',
                    });
                    that.$router.push({ path: '/Forum' })
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))
        },


        showDeleteFloor(floorId) {
            this.tokenCheck()
            this.$confirm(
                '确认删除该floor？',
                'Warning',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                this.deleteFloor(floorId);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除',
                });
            });
        },
        deleteFloor(floorId) {
            let that = this
            that.$axios.delete('/forum/floor/deleteFloor/' + floorId, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    console.log("删除的floor的id为：" + floorId)
                    this.$message({
                        type: 'info',
                        message: '删除成功',
                    });
                    that.loadFloors(ref(0))
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))
        },

        showDeleteComment(commentId, floorID) {
            this.tokenCheck()
            this.$confirm(
                '确认删除该comment？',
                'Warning',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                this.deleteComment(commentId, floorID);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除',
                });
            });
        },
        deleteComment(commentId, floorID) {// 执行删除评论的逻辑
            let that = this
            that.$axios.delete('/forum/comment/deleteComment/' + commentId, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    console.log("删除的comment的id为：" + commentId)
                    this.$message({
                        type: 'info',
                        message: '删除成功',
                    });
                    that.loadAllComments(floorID)
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))
        },

        editPost() {
            this.tokenCheck()
            this.formPost = Object.assign({}, this.post)
            this.postDialogVisible = true
        },
        submitEditForm() {
            if (this.formPost.title === '') {
                return this.$message.error("帖子标题不能为空")
            } else if (this.formPost.content === '') {
                return this.$message.error("帖子正文不能为空")
            } else if (this.formPost.tag === -1) {
                return this.$message.error("类别不能为空")
            }

            let that = this
            let id = that.$route.params.postID;
            that.$axios.post('/forum/post/changePost', null, {
                params: {
                    post_id: id,
                    tag: that.formPost.tag,
                    pinIdStr: "76;77;78",
                    title: that.formPost.title,
                    content: that.formPost.content,
                },
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                //console.log(res)
                if (res.data.code == 200) {
                    that.getPostDetail()
                }
            })
            that.postDialogVisible = false
        },




        showReportPostPrompt() {
            if (!this.$cookies.get('user_token')) {
                this.$message({
                    message: '请先登录!',
                    type: "warning"
                })
                this.$router.push({ path: '/login' })
            } else {
                this.$prompt('请输入举报理由', '举报帖子', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    inputPlaceholder: '请输入举报理由',
                    inputValidator: (value) => {
                        if (!value) {
                            return '举报理由不能为空';
                        }
                    },
                }).then(({ value }) => {
                    this.reportPost(value);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消举报',
                    });
                });
            }
        },
        reportPost(reason) {// 执行举报post的逻辑
            let that = this
            that.$axios.post('/forum/report/reportPost', {
                id: that.post.id,
                reason: reason,
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then(response => {
                console.log(response);
            }).catch(error => {
                console.error(error);
            });
        },

        showReportReplyPrompt(type, id) {
            if (!this.$cookies.get('user_token')) {
                this.$message({
                    message: '请先登录!',
                    type: "warning"
                })
                this.$router.push({ path: '/login' })
            } else {
                this.$prompt('请输入举报理由', '举报reply', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    inputPlaceholder: '请输入举报理由',
                    inputValidator: (value) => {
                        if (!value) {
                            return '举报理由不能为空';
                        }
                    },
                }).then(({ value }) => {
                    this.reportReply(value, type, id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消举报',
                    });
                });
            }
        },
        reportReply(reason, type, id) {// 执行举报reply的逻辑
            console.log('举报reply type= ' + type + '，理由为：' + reason);
            let that = this
            that.$axios.post('/forum/report/reportReply', {
                id: id,
                reason: reason,
                type: type
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then(response => {
                //console.log(response);
            }).catch(error => {
                console.error(error);
            });
        },

        addLike() {
            this.tokenCheck()
            let that = this
            //console.log("初始点赞"+that.post.thumbsUp)
            that.$axios.get('/forum/post/addLike/' + that.post.id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    //console.log("点赞成功");
                    that.getPostDetail()
                    //console.log("现在点赞"+that.post.thumbsUp)
                }
            }).catch((res) => console.log(res))
        }
    },

    mounted() {
        this.initPost();
    },
}
</script>
    
<style>
.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.main {
    display: flex;
    justify-content: space-between;
    margin: 0, 15%;
}

.left,
.right {
    width: 15%;
}


.center {
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.post_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
}


.post_title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    flex: 1;
    text-align: left;
}

.post_stars,
.post_tags {
    color: #999;
    margin-bottom: 10px;
    margin-left: 20px;
}

.post_body {
    margin-bottom: 20px;
}

.post_footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    height: 100px;
    align-items: center;
}

.post_reply-btn {
    margin-left: auto;
}

.post_floors {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
}

.post_floor {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}

.post_floor-header {
    color: #999;
    margin-bottom: 10px;
}

.post_floor-body {
    margin-bottom: 10px;
}

.post_floor-footer {
    display: flex;
    justify-content: flex-end;
}

.post_floor-reply-btn {
    margin-left: 10px;
}
</style>