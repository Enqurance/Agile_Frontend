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
                        <span class="post_title">{{ post.title }}</span>
                        <span class="post_title">{{ post.content }}</span>
                        <div class="post_tags">{{ post.tags }}</div>
                        <div class="post_stars">收藏数量：{{ post.stars }}</div>
                        <el-button type="danger" @click="showDeletePost">删除post</el-button>
                        <el-button type="danger" @click="showReportPostPrompt">举报post</el-button>
                        <el-button @click="editPost">编辑post</el-button>
                    </div>
                    <div class="post_body">{{ post.body }}</div>
                    <div>
                        <el-dialog :title="testInfo" v-model="postDialogVisible">
                            <div>
                                <el-button @click="postDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="submitEditForm">确认</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <div class="post_footer">
                        <div class="avatar">
                            <img :src="this.imageUrl" alt="avatar" class="avatar-img">
                        </div>
                        <el-button class="post_reply-btn" @click="showNewFloorDialog">回复帖子</el-button>
                        <el-dialog v-model="newFloorDialogVisible">
                            <el-form :model="newFloorForm" ref="newFloorForm" label-width="80px">
                                <el-form-item label="评论内容">
                                    <el-input v-model="newFloorForm.body" type="textarea"></el-input>
                                </el-form-item>
                            </el-form>
                            <div>
                                <el-button @click="newFloorDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="addNewFloor">提交</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <div class="post_floors">
                        <div class="post_floor" v-for="(floor, index) in floors" :key="index">
                            <div class="post_floor-header">(用户id){{ floor.userid }} 发表于 {{ floor.createTime }}</div>
                            <div class="post_floor-body">{{ floor.content }}</div>

                            <el-button type="danger" @click="showDeleteFloor(floor.id)">删除floor</el-button>
                            <el-button type="danger" @click="showReportReplyPrompt(0)">举报floor</el-button>
                            <!-- <div v-if="floor.comments.length > 0">
                                <div class="post_floor-comments-preview"
                                    v-for="(comment, index) in floor.comments.slice(0, 2)" :key="index">
                                    <div class="post_floor-comment-header">{{ comment.user }} 评论于 {{ comment.time }}</div>
                                    <div class="post_floor-comment-body">{{ comment.body }}</div>
                                </div>
                            </div> -->
                            <!-- <div class="post_floor-footer">
                                <el-button class="post_floor-reply-btn" @click="showAllCommentsDialog(index)">查看全部{{
                                    commentCount(index) }}条评论</el-button>
                            </div> -->
                            <el-dialog v-model="floor.commentsDialogVisible" title="全部评论" width="50%">
                                <div class="post_floor-comments" v-for="comment in floor.comments" :key="comment.id">
                                    <el-button type="danger" @click="showDeleteComment(comment.id)">删除comment</el-button>
                                    <el-button type="danger" @click="showReportReplyPrompt(1)">举报comment</el-button>
                                    <div class="post_floor-comment-header">{{ comment.user }} 评论于 {{ comment.time }}</div>
                                    <div class="post_floor-comment-body">{{ comment.body }}</div>
                                </div>
                                <el-form>
                                    <el-form-item>
                                        <el-input v-model="floor.newComment" placeholder="请输入评论内容"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="addComment(index)">提交评论</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-dialog>
                        </div>
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

            // floors: [
            //     {
            //         id: 1,
            //         user: '张三',
            //         time: '2021-01-01 10:00:00',
            //         body: '这是第一层楼',
            //         comments: [
            //             {
            //                 id: 1,
            //                 user: '李四',
            //                 time: '2021-01-01 10:10:00',
            //                 body: '这是第一层楼的第一条评论'
            //             },
            //             {
            //                 id: 2,
            //                 user: '王五',
            //                 time: '2021-01-01 10:20:00',
            //                 body: '这是第一层楼的第二条评论'
            //             },
            //             {
            //                 id: 3,
            //                 user: '赵六',
            //                 time: '2021-01-01 10:30:00',
            //                 body: '这是第一层楼的第三条评论'
            //             },
            //             {
            //                 id: 4,
            //                 user: '赵六',
            //                 time: '2021-01-01 10:30:00',
            //                 body: '这是第一层楼的第四条评论'
            //             }
            //         ],
            //         commentsDialogVisible: false,
            //         newComment: ''
            //     },
            //     {
            //         id: 2,
            //         user: '李四',
            //         time: '2021-01-01 11:00:00',
            //         body: '这是第二层楼',
            //         comments: [
            //             {
            //                 id: 1,
            //                 user: '张三',
            //                 time: '2021-01-01 11:10:00',
            //                 body: '这是第二层楼的第一条评论'
            //             }
            //         ],
            //         commentsDialogVisible: false,
            //         newComment: ''
            //     },
            //     {
            //         id: 3,
            //         user: '用户3',
            //         time: '2021-01-02 12:00:00',
            //         body: '这是另一条评论的内容',
            //         comments: [],
            //         commentsDialogVisible: false,
            //         newComment: ''
            //     },
            //     {
            //         id: 4,
            //         user: '用户4',
            //         time: '2021-01-01 12:00:00',
            //         body: '这是一条评论的内容',
            //         comments: [],
            //         commentsDialogVisible: false,
            //         newComment: ''
            //     },
            //     {
            //         id: 5,
            //         user: '用户5',
            //         time: '2021-01-02 12:00:00',
            //         body: '这是另一条评论的内容',
            //         comments: [],
            //         commentsDialogVisible: false,
            //         newComment: ''
            //     },
            //     {
            //         id: 6,
            //         user: '用户6',
            //         time: '2021-01-02 12:00:00',
            //         body: '这是另一条评论的内容',
            //         comments: [],
            //         commentsDialogVisible: false,
            //         newComment: ''
            //     },
            // ],
        };
    },

    setup() {
        const { proxy } = getCurrentInstance();
        const imageUrl = ref('');
        const floors = ref([]); 
        const isLoading = ref(false); 
        const offset = ref(0);
        const limit = 5;

        const id = proxy.$route.params.postID;

        const loadFloors = (offset) => {
            console.log(offset.value)
            isLoading.value = true;
            proxy.$axios.post('/forum/floor/getFloors', null, {
                params: {
                    post_id:id,
                    offset: parseInt(offset.value),
                    limit: parseInt(limit)
                },
                headers: {
                    'token': proxy.$cookies.get('user_token')
                }
            }).then((res) => {
                console.log(res.data.data)
                floors.value = [...floors.value, ...res.data.data];
                isLoading.value = false;
            }).catch((error) => {
                console.log(error);
                isLoading.value = false;
            });
        };

        onMounted(() => {
            loadFloors(offset);
        });

        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                offset.value += limit;
                loadFloors(offset);
            }
        });

        return { imageUrl, floors, isLoading, };
    },

    methods: {
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
                that.post = res.data.data.post
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





        showNewFloorDialog() {
            this.newFloorDialogVisible = true
        },

        addNewFloor() {
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
                console.log(response)
            })
            this.newFloorDialogVisible = false
        },









        commentCount(index) {
            return this.commentCounts[index];
        },

        showAllCommentsDialog(index) {
            console.log("show floor")
            console.log("floor id" + this.floors[index].id)

            this.floors[index].commentsDialogVisible = true
        },

        addComment(index) {
            console.log("floor id" + this.floors[index].id)
            this.floors[index].commentsDialogVisible = false
        },

        showDeletePost() {
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
                console.log(res)
                if (res.data.code === 200) {
                    console.log("删除的floor的id为：" + floorId)
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

        showDeleteComment(commentId) {
            this.$confirm(
                '确认删除该comment？',
                'Warning',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                this.deleteComment(commentId);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除',
                });
            });
        },
        deleteComment(commentId) {// 执行删除评论的逻辑
            console.log('删除评论ID为' + commentId);
        },

        editPost() {
            this.formPost = Object.assign({}, this.post)
            this.postDialogVisible = true
        },
        submitEditForm() {

        },




        showReportPostPrompt() {
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

        showReportReplyPrompt(type) {
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
                this.reportReply(value, type);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消举报',
                });
            });
        },
        reportReply(reason, type) {// 执行举报reply的逻辑
            console.log('举报reply type= ' + type + '，理由为：' + reason);
            let that = this
            that.$axios.post('/forum/report/reportReply', {
                id: that.post.id,
                reason: reason,
                type: type
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
    },

    mounted() {
        this.initPost();
    },

    computed: {
        commentCounts() {
            if (this.floors.length > 0) {
                return this.floors.map(floor => floor.comments.length);
            } else {
                return [];
            }
        }
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