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
                        <div class="post_tags">{{ post.tags }}</div>
                        <div class="post_stars">收藏数量：{{ post.stars }}</div>
                        <el-button type="danger" @click="showDeletePost">删除post</el-button>
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
                                <el-form-item label="用户名">
                                    <el-input v-model="newFloorForm.user"></el-input>
                                </el-form-item>
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
                            <div class="post_floor-header">{{ floor.user }} 发表于 {{ floor.time }}</div>
                            <div class="post_floor-body">{{ floor.body }}</div>

                            <el-button type="danger" @click="showDeleteFloor(index)">删除floor</el-button>
                            <div v-if="floor.comments.length > 0">
                                <div class="post_floor-comments-preview"
                                    v-for="(comment, index) in floor.comments.slice(0, 2)" :key="index">
                                    <div class="post_floor-comment-header">{{ comment.user }} 评论于 {{ comment.time }}</div>
                                    <div class="post_floor-comment-body">{{ comment.body }}</div>
                                </div>
                            </div>
                            <div class="post_floor-footer">
                                <el-button class="post_floor-reply-btn" @click="showAllCommentsDialog(index)">查看全部{{
                                    commentCount(index) }}条评论</el-button>
                            </div>
                            <el-dialog v-model="floor.commentsDialogVisible" title="全部评论" width="50%">
                                <div class="post_floor-comments" v-for="comment in floor.comments" :key="comment.id">
                                    <el-button type="danger" @click="showDeleteComment(comment.id)">删除comment</el-button>
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
import { ref } from 'vue'
import PageHeader from "@/components/pc/PCPageHeader.vue";

export default {
    name: "PCPostpage",

    components: {
        PageHeader,
    },

    data() {
        return {
            post: {
                id: 1,
                title: '我是帖子的标题',
                tags: '标签1，标签2，标签3',
                stars: 1,
                body: "我是帖子的内容，我是帖子的内容，我是帖子的内容，我是帖子的内容，我是帖子的内容，我是帖子的内容，我是帖子的内容，"
            },

            postDialogVisible: false,
            formPost: {

            },

            newFloorDialogVisible: false,
            newFloorForm: {
                user: '',
                body: ''
            },

            floors: [
                {
                    id: 1,
                    user: '张三',
                    time: '2021-01-01 10:00:00',
                    body: '这是第一层楼',
                    comments: [
                        {
                            id: 1,
                            user: '李四',
                            time: '2021-01-01 10:10:00',
                            body: '这是第一层楼的第一条评论'
                        },
                        {
                            id: 2,
                            user: '王五',
                            time: '2021-01-01 10:20:00',
                            body: '这是第一层楼的第二条评论'
                        },
                        {
                            id: 3,
                            user: '赵六',
                            time: '2021-01-01 10:30:00',
                            body: '这是第一层楼的第三条评论'
                        },
                        {
                            id: 4,
                            user: '赵六',
                            time: '2021-01-01 10:30:00',
                            body: '这是第一层楼的第四条评论'
                        }
                    ],
                    commentsDialogVisible: false,
                    newComment: ''
                },
                {
                    id: 2,
                    user: '李四',
                    time: '2021-01-01 11:00:00',
                    body: '这是第二层楼',
                    comments: [
                        {
                            id: 1,
                            user: '张三',
                            time: '2021-01-01 11:10:00',
                            body: '这是第二层楼的第一条评论'
                        }
                    ],
                    commentsDialogVisible: false,
                    newComment: ''
                },
                {
                    id: 3,
                    user: '用户3',
                    time: '2021-01-02 12:00:00',
                    body: '这是另一条评论的内容',
                    comments: [],
                    commentsDialogVisible: false,
                    newComment: ''
                },
                {
                    id: 4,
                    user: '用户4',
                    time: '2021-01-01 12:00:00',
                    body: '这是一条评论的内容',
                    comments: [],
                    commentsDialogVisible: false,
                    newComment: ''
                },
                {
                    id: 5,
                    user: '用户5',
                    time: '2021-01-02 12:00:00',
                    body: '这是另一条评论的内容',
                    comments: [],
                    commentsDialogVisible: false,
                    newComment: ''
                },
                {
                    id: 6,
                    user: '用户6',
                    time: '2021-01-02 12:00:00',
                    body: '这是另一条评论的内容',
                    comments: [],
                    commentsDialogVisible: false,
                    newComment: ''
                },
            ],
        };
    },

    setup() {
        const imageUrl = ref('');
        return { imageUrl };
    },

    methods: {
        initPost() {
            console.log("init")
            this.getIcon()
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






        showNewFloorDialog() {
            this.newFloorDialogVisible = true
        },

        addNewFloor() {
            //todo
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
            )
                .then(() => {
                    this.deletePost();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消删除',
                    });
                });
        },
        deletePost() {// 执行删除post的逻辑
            console.log('删除post');
            this.$router.push({ path: '/Forum' })
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
            )
                .then(() => {
                    this.deleteFloor(floorId);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消删除',
                    });
                });
        },
        deleteFloor(floorId) {// 执行删除评论的逻辑
            console.log('删除floor ID为' + floorId);
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
            )
                .then(() => {
                    this.deleteComment(commentId);
                })
                .catch(() => {
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