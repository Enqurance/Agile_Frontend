<template>
    <el-container>
<<<<<<< HEAD
<<<<<<< HEAD
        <el-header>
            <PageHeader />
=======
        <el-header style="padding-left: 0;padding-right: 0">
            <PageHeader/>
>>>>>>> 1e859e8 ([chore](Global):美化样式)
=======
        <el-header style="padding-left: 0;padding-right: 0">
            <PageHeader/>
=======
        <el-header>
            <PageHeader />
>>>>>>> cd7e101 ([fix](forumPage、postPage)：论坛页面文字按钮替换为图标+提示)
>>>>>>> 06549d2 ([fix](forumPage、postPage)：论坛页面文字按钮替换为图标+提示)
        </el-header>
        <el-main>
            <div class="main">
                <div class="left"></div>

                <div class="center">
                    <div class="post_header">
                        <div class="title">
                            <h2 style="padding-bottom: 15px;">{{ post.title }}</h2>
<<<<<<< HEAD
                            <div style="display: flex; align-items: center;margin-bottom: 10px;font-size:18px;">
                                <el-tag class="tag" style="margin-right: 10px;">{{ _get_pin_type(post.tag) }}</el-tag>
                                <el-popover placement="right" width="220" trigger="hover">
                                    <p>昵称：{{ userInfo.name }}</p>
                                    <p>邮箱：{{ userInfo.email }}</p>
                                    <p>个人描述：{{ userInfo.description }}</p>
                                    <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                    <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                    <p>性别：{{ getGender(userInfo.gender) }}</p>
                                    <template v-slot:reference>
                                        <el-link :underline="false" type="primary" style="font-size:18px;"
                                            @mouseenter="showPopover(post.userId)">{{ post.userName
                                            }}</el-link>
                                    </template>
                                </el-popover>

                                <p style="padding-left: 10px;">{{ getTimeSubstring(post.createTime) }}</p>

                            </div>

=======
                            <div style="display: flex; align-items: center;margin-bottom: 10px;">
                                <el-tag class="tag" style="margin-right: 10px;">{{ _get_pin_type(post.tag) }}</el-tag>
                                <el-button @click="addLike" circle>
                                    <HeartTwoTone v-if="post.has_thumb" twoToneColor="#eb2f96" />
                                    <HeartOutlined v-else />
                                </el-button>
                            </div>

>>>>>>> 06549d2 ([fix](forumPage、postPage)：论坛页面文字按钮替换为图标+提示)
                            <div v-if="tags.length > 0"
                                style="display: flex;flex-wrap: wrap;margin-top: 10px;margin-bottom: 10px;">
                                <div v-for="(tag, index) in tags" :key="index" style="margin-right: 10px;">
                                    <el-tag size="small" effect="plain" type="success">{{ tag }}</el-tag>
                                </div>
                            </div>

                            <el-tooltip content="删除帖子" placement="bottom">
                                <el-button v-if="post.is_auth" type="danger" @click="showDeletePost" circle>
                                    <DeleteOutlined />
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="举报帖子" placement="bottom">
                                <el-button type="danger" @click="showReportPostPrompt" circle>
                                    <QuestionCircleOutlined />
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="编辑帖子" placement="bottom">
                                <el-button v-if="post.is_auth" @click="editPost" circle>
                                    <EditOutlined />
                                </el-button>
                            </el-tooltip>
<<<<<<< HEAD
                            <el-tooltip content="点赞帖子" placement="bottom">
                                <el-button @click="addLike" circle>
                                    <HeartTwoTone v-if="post.has_thumb" twoToneColor="#eb2f96" />
                                    <HeartOutlined v-else />
                                </el-button>
                            </el-tooltip>
=======
>>>>>>> 06549d2 ([fix](forumPage、postPage)：论坛页面文字按钮替换为图标+提示)
                        </div>
                        <div style="width: 100px;">
                            <el-descriptions title="   " :column="1" style="width: 100px;">
                                <el-descriptions-item label="点赞数">{{ post.thumbsUp }}</el-descriptions-item>
                                <el-descriptions-item label="访问量">{{ post.visit }}</el-descriptions-item>
                                <el-descriptions-item label="楼层数">{{ post.floorNum }}</el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </div>
                    <div class="post_content" style="text-align: left; font-size: 20px;">
                        <p>{{ post.content }}</p>
                    </div>

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
                                </el-form>
                                <el-button type="primary" @click="submitEditForm">确认</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <div class="post_footer">
                        <el-avatar :size="70" shape="circle" :src="this.imageUrl" style="user-select: none;">
                        </el-avatar>
                        <el-button type="info" plain @click="newFloorDialogVisible = true"
                            style="margin-left: 10px;">回复帖子</el-button>
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

                    <div class="post_floors" style="width: 100%;">
                        <div v-for="floor in floors" :key="floor.id" style="padding-top: 5px;">
                            <el-card style="min-height: auto;">
                                <div class="post_floor-header">
                                    <div>
                                        <el-popover placement="right" width="220" trigger="hover">
                                            <p>昵称：{{ userInfo.name }}</p>
                                            <p>邮箱：{{ userInfo.email }}</p>
                                            <p>个人描述：{{ userInfo.description }}</p>
                                            <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                            <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                            <p>性别：{{ getGender(userInfo.gender) }}</p>
                                            <template v-slot:reference>
                                                <el-link :underline="false" type="primary" style="font-size:18px;"
                                                    @mouseenter="showPopover(floor.userId)">{{ floor.userName
                                                    }}</el-link>
                                            </template>
                                        </el-popover>
                                        <span>发表于 {{ getTimeSubstring(floor.createTime) }} </span>
                                    </div>
                                    <div class="floor-number">
                                        <span style="margin-right: 10px;">{{ floor.layers }}楼</span>
                                        <el-tooltip content="删除楼层" placement="bottom">
                                            <el-button v-if="floor.is_auth" type="danger" plain
                                                @click="showDeleteFloor(floor.id)">
                                                <DeleteOutlined />
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip content="举报楼层" placement="bottom">
                                            <el-button type="danger" plain @click="showReportReplyPrompt(0, floor.id)">
                                                <QuestionCircleOutlined />
                                            </el-button>
                                        </el-tooltip>
                                    </div>
                                </div>
                                <div style="margin-bottom: 10px;font-size: 20px;">{{ floor.content }}</div>

                                <div v-if="!floor.comment_cases"
                                    style="display: flex; justify-content: flex-end;margin-right: 20px;">
                                    <el-button @click="showComments(floor.id)">回复楼层</el-button>
                                </div>

                                <el-dialog v-model="commentsDialogVisible" title="全部评论" width="50%" :modal="false">
                                    <div v-for="comment in comments" :key="comment.id">
                                        <el-card style="min-height: auto;" shadow="never">
                                            <div>
                                                <el-popover placement="right" width="220" trigger="hover">
                                                    <p>昵称：{{ userInfo.name }}</p>
                                                    <p>邮箱：{{ userInfo.email }}</p>
                                                    <p>个人描述：{{ userInfo.description }}</p>
                                                    <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                                    <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                                    <p>性别：{{ getGender(userInfo.gender) }}</p>
                                                    <template v-slot:reference>
                                                        <el-link :underline="false" type="primary" style="font-size:18px;"
                                                            @mouseenter="showPopover(comment.cuserId)">{{ comment.cuserName }}</el-link>
                                                    </template>
                                                </el-popover>

                                                <span style="font-size: 18px;">发表于 {{ getTimeSubstring(comment.createTime) }} </span>
                                            </div>
                                            <el-tooltip content="删除评论" placement="bottom">
                                                <el-button v-if="comment.is_auth" type="danger"
                                                    @click="showDeleteComment(comment.id, floor.id)" circle plain>
                                                    <DeleteOutlined />
                                                </el-button>
                                            </el-tooltip>
                                            <el-tooltip content="举报评论" placement="bottom">
                                                <el-button type="danger" @click="showReportReplyPrompt(1, comment.id)"
                                                    circle plain>
                                                    <QuestionCircleOutlined />
                                                </el-button>
                                            </el-tooltip>
                                            <div>
                                                <p style="font-size: 18px;">{{ comment.content }}</p>
                                            </div>
                                        </el-card>
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
                                <el-card v-if="floor.comment_cases" shadow="never">
                                    <div style="display:flex;align-items: center;justify-content: space-between;">
                                        <div>
                                            <el-popover placement="right" width="220" trigger="hover">
                                                <p>昵称：{{ userInfo.name }}</p>
                                                <p>邮箱：{{ userInfo.email }}</p>
                                                <p>个人描述：{{ userInfo.description }}</p>
                                                <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                                <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                                <p>性别：{{ getGender(userInfo.gender) }}</p>
                                                <template v-slot:reference>
                                                    <el-link :underline="false" type="primary" style="font-size:18px;"
                                                        @mouseenter="showPopover(floor.comment_cases.cuserId)">{{
                                                            floor.comment_cases.cuserName
                                                        }}</el-link>
                                                </template>
                                            </el-popover>
                                            <span> ：{{ floor.comment_cases.content }}</span>
                                        </div>
                                        <el-button @click="showComments(floor.id)">查看全部评论</el-button>
                                    </div>
                                </el-card>
                            </el-card>
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
import global from '@/global'
import { DeleteOutlined, QuestionCircleOutlined, EditOutlined, HeartOutlined, HeartTwoTone } from '@ant-design/icons-vue';

export default {
    name: "PCPostpage",

    components: {
        PageHeader,
        DeleteOutlined,
        QuestionCircleOutlined,
        EditOutlined,
        HeartOutlined,
        HeartTwoTone
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

            userInfo: {}
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
<<<<<<< HEAD
                    console.log("floors")
                    console.log(res.data.data.retFloors)
=======
                    //console.log("floors")
                    //console.log(res.data.data.retFloors)
>>>>>>> 06549d2 ([fix](forumPage、postPage)：论坛页面文字按钮替换为图标+提示)
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
        showPopover(user_id) {
            let that = this
            that.$axios.get('/user/getUserById/' + user_id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                console.log(res)
                if (res.data.code === 200) {
                    that.userInfo = res.data.data
                    console.log(that.userInfo)
                }
            }).catch((res) => console.log(res))
        },

        _get_pin_type(pin_type_id) {
            return global.get_pin_type(pin_type_id)
        },

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
                //console.log("getPostDetail()")
                //console.log(res.data.data)
            }).catch((error) => {
                console.log(error);
            });
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

        showComments(floorID) {
            this.loadAllComments(floorID)
            this.commentsDialogVisible = true
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
                console.log(res.data)
                if (res.data.code == 200) {
                    that.comments = res.data.data.retComments
                    //console.log("getComments")
<<<<<<< HEAD
                    console.log(res.data.data.retComments)
=======
                    //console.log(res.data.data.retComments)
>>>>>>> 06549d2 ([fix](forumPage、postPage)：论坛页面文字按钮替换为图标+提示)
                } else {
                    that.comments = []
                }
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
                    that.loadFloors(ref(0))
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
            }

            let that = this
            let id = that.$route.params.postID;
            that.$axios.post('/forum/post/changePost', null, {
                params: {
                    post_id: id,
                    tag: that.formPost.tag,
                    pinIdStr: that.formPost.pinIdStr,
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
        },

        getTimeSubstring(timeString) {
            if (timeString) {
                return timeString.substring(5, 16);
            }
        },

        getGrade(value) {
            return value === '1' ? '本科' : value === '2' ? '硕士' : value === '3' ? '博士' : ''
        },

        getCampus(value) {
            return value === '1' ? '学院路校区' : value === '2' ? '沙河校区' : ''
        },

        getGender(value) {
            return value === 1 ? '女' : value === 0 ? '男' : ''
        }
    },

    mounted() {
        this.initPost();
    },

    computed: {
        tags() {
            if (this.post.pinNameStr) {
                return this.post.pinNameStr.split(";");
            } else {
                return [];
            }
        }
    },
}
</script>
    
<style scoped>
.title {
    align-items: flex-start;
    justify-content: space-between;
    padding-top: 10px
}

.title h2 {
    margin: 0;
    color: #333;
}

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
    align-items: flex-start;
    justify-content: center;
}

.post_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    width: 100%;
}

.card_header {
    display: flex;
    justify-content: space-between;

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
    margin-bottom: 20px;
    align-items: center;
}

.post_reply-btn {
    margin-left: auto;
}

.post_floor-header {
    color: #999;
    margin-bottom: 10px;
    font-size: 18px;

    display: flex;
    justify-content: space-between;
}

.post_floor-footer {
    display: flex;
    justify-content: flex-end;
}

.post_floor-reply-btn {
    margin-left: 10px;
}
</style>