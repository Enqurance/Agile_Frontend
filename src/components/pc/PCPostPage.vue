<template>
    <el-container>
        <el-header style="padding-left: 0;padding-right: 0">
            <PageHeader />
        </el-header>
        <el-main>
            <div class="main">
                <div class="left"></div>

                <div class="center">
                    <div class="post_header">
                        <div class="title">
                            <div class="clearfix">
                                <div style="float: left">
                                    <el-avatar :size="70" shape="circle" :src="this.imageUrl" style="user-select: none;" />
                                </div>
                                <div
                                    style="float: left; padding-left: 15px; height: 70px; display: flex; align-items: center">
                                    <div>
                                        <div style="margin-bottom: 10px">
                                            <el-popover placement="right" width="220" trigger="hover">
                                                <p>昵称：{{ userInfo.name }}</p>
                                                <p>邮箱：{{ userInfo.email }}</p>
                                                <p>个人描述：{{ userInfo.description }}</p>
                                                <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                                <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                                <p>性别：{{ getGender(userInfo.gender) }}</p>
                                                <template v-slot:reference>
                                                    <el-link :underline="false" type="primary" style="font-size:18px;"
                                                        @mouseenter="showPopover(post.userId)">
                                                        {{ post.userName }}
                                                    </el-link>
                                                </template>
                                            </el-popover>
                                        </div>
                                        <div>
                                            <el-text tag="i">
                                                创建时间：{{ getTimeSubstring(post.createTime) }}
                                            </el-text>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h1>{{ post.title }}</h1>

                            <div
                                style="display: flex; align-items: center;margin-bottom: 10px;font-size:18px; margin-top: -15px">
                                <div style="align-items: center; padding-right: 20px">
                                    <el-tag class="tag" style="margin-right: 10px;">
                                        {{ _get_pin_type(post.tag) }}
                                    </el-tag>
                                </div>
                                <div v-if="tags.length > 0"
                                    style="display: flex;flex-wrap: wrap;margin-top: 10px;margin-bottom: 10px;">
                                    <div v-for="(tag, index) in tags" :key="index" style="margin-right: 10px;">
                                        <el-tag size="small" effect="plain" type="success">{{ tag }}</el-tag>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="width: 100px;padding-top: 20px">
                            <el-descriptions :column="1" style="width: 100px;">
                                <el-descriptions-item label="点赞数:">{{ post.thumbsUp }}</el-descriptions-item>
                                <el-descriptions-item label="访问量:">{{ post.visit }}</el-descriptions-item>
                                <el-descriptions-item label="楼层数:">{{ post.floorNum }}</el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </div>

                    <div style="text-align: left; font-size: 20px; width: 100%">
                        <el-text tag="b" style="font-size: 16px; color: black">内容：</el-text>
                        <div style="padding-bottom: 10px">
                            <!-- <pre style="font-size: 14px; word-wrap: break-word;font-family: 'Open Sans', sans-serif;
                            white-space: pre-wrap;">{{ post.content }}</pre> -->
                            <div v-html="post.content"></div>
                        </div>
                    </div>

                    <div class="clearfix" style="position: relative; width: 100%; margin-bottom: 20px">
                        <div style="float: left">
                            <div class="clearfix">
                                <el-tooltip content="删除帖子" placement="bottom">
                                    <div style="float: left; margin-right: 10px">
                                        <el-button v-if="post.is_auth" @click="showDeletePost" circle>
                                            <DeleteOutlined style="color: red" />
                                        </el-button>
                                    </div>
                                </el-tooltip>
                                <el-tooltip content="举报帖子" placement="bottom">
                                    <div style="float: left; margin-right: 10px">
                                        <el-button @click="showReportPostPrompt" circle>
                                            <QuestionCircleOutlined style="color: red" />
                                        </el-button>
                                    </div>
                                </el-tooltip>
                                <el-tooltip content="编辑帖子" placement="bottom">
                                    <div style="float: left; margin-right: 10px">
                                        <el-button v-if="post.is_auth" @click="editPost" circle>
                                            <EditOutlined />
                                        </el-button>
                                    </div>
                                </el-tooltip>
                                <el-tooltip content="点赞帖子" placement="bottom">
                                    <div style="float: left; margin-right: 10px">
                                        <el-button @click="addLike" circle>
                                            <HeartTwoTone v-if="post.has_thumb" style="color: red" twoToneColor="red" />
                                            <HeartOutlined v-else style="color: black" />
                                        </el-button>
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                        <div style="float: left; right: 0; position: absolute">
                            <el-button type="info" plain @click="newFloorDialogVisible = true" style="margin-left: 10px">
                                回复帖子
                            </el-button>
                        </div>
                    </div>

                    <el-dialog v-model="postDialogVisible" title="编辑帖子" center>
                        <div>
                            <el-form>
                                <el-form-item label="标题">
                                    <el-input v-model="formPost.title" autosize maxlength="60"></el-input>
                                </el-form-item>
                                <!-- <el-form-item label="正文">
                                    <el-input v-model="formPost.content" type="textarea" :rows="6"
                                              maxlength="200"></el-input>
                                </el-form-item> -->
                                <el-form-item label="正文">
                                    <div style="width:100%">
                                        <MyEditor @input="updateContent" :initialValue="post.content"
                                            :sendData="formPost.content"></MyEditor>
                                    </div>
                                </el-form-item>
                            </el-form>
                            <div class="clearfix">
                                <div style="float: right">
                                    <el-button type="primary" @click="submitEditForm">提交更改</el-button>
                                </div>
                            </div>
                        </div>
                    </el-dialog>

                    <el-dialog v-model="newFloorDialogVisible" title="新建楼层" center>
                        <el-form :model="newFloorForm" ref="newFloorForm" label-width="80px">
                            <el-form-item label="回复内容">
                                <el-input v-model="newFloorForm.body" :rows="5" clearable type="textarea"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="clearfix">
                            <div style="float: right">
                                <el-button type="primary" size="large" @click="addNewFloor">提交</el-button>
                            </div>
                        </div>
                    </el-dialog>

                    <div style="width: 100%; padding-bottom: 70px">
                        <div v-for="floor in this.floors" :key="floor.id" style="padding-top: 10px;">
                            <el-card style="min-height: auto; margin-bottom: 20px">
                                <div class="post_floor-header">
                                    <div style="width: 80%">
                                        <div style="width: 100%">
                                            <div style="padding-left: 20px">
                                                <el-popover placement="right" width="220" trigger="hover">
                                                    <p>昵称：{{ userInfo.name }}</p>
                                                    <p>邮箱：{{ userInfo.email }}</p>
                                                    <p>个人描述：{{ userInfo.description }}</p>
                                                    <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                                    <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                                    <p>性别：{{ getGender(userInfo.gender) }}</p>
                                                    <template v-slot:reference>
                                                        <el-link :underline="false" type="primary" style="font-size:20px;"
                                                            @mouseenter="showPopover(floor.userId)">
                                                            {{ floor.userName }}
                                                        </el-link>
                                                    </template>
                                                </el-popover>
                                            </div>
                                            <div style="margin-left: 20%">
                                                <span style="font-size: 13px">——发表于 {{ getTimeSubstring(floor.createTime) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span style="margin-right: 10px;">{{ floor.layers }}楼</span>
                                    </div>
                                </div>

                                <div style="margin-bottom: 5px; font-size: 20px;padding-left: 20px; padding-right: 20px">
                                    {{ floor.content }}
                                </div>

                                <div class="clearfix" style="margin-bottom: 20px">
                                    <el-tooltip content="举报楼层" placement="bottom">
                                        <div style="float: right; margin-left: 10px; margin-right: 20px">
                                            <el-button circle @click="showReportReplyPrompt(0, floor.id)">
                                                <QuestionCircleOutlined style="color: red" />
                                            </el-button>
                                        </div>
                                    </el-tooltip>
                                    <el-tooltip content="删除楼层" placement="bottom">
                                        <div style="float: right">
                                            <el-button v-if="floor.is_auth" circle @click="showDeleteFloor(floor.id)">
                                                <DeleteOutlined style="color: red" />
                                            </el-button>
                                        </div>
                                    </el-tooltip>
                                </div>

                                <div v-if="!floor.comment_cases"
                                    style="display: flex; justify-content: flex-end;margin-right: 20px;">
                                    <el-button @click="showComments(floor.id)">回复楼层</el-button>
                                </div>
                                <el-card v-else shadow="never">
                                    <div style="width: 100%">
                                        <el-container style="width: 100%">
                                            <el-main>
                                                <div>
                                                    <el-popover placement="right" width="220" trigger="hover">
                                                        <p>昵称：{{ userInfo.name }}</p>
                                                        <p>邮箱：{{ userInfo.email }}</p>
                                                        <p>个人描述：{{ userInfo.description }}</p>
                                                        <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                                        <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                                        <p>性别：{{ getGender(userInfo.gender) }}</p>
                                                        <template v-slot:reference>
                                                            <el-link :underline="false" type="primary"
                                                                style="font-size:18px;"
                                                                @mouseenter="showPopover(floor.comment_cases.cuserId)">
                                                                {{ floor.comment_cases.cuserName }}
                                                            </el-link>
                                                        </template>
                                                    </el-popover>
                                                    <span>:</span>
                                                </div>
                                                <div>
                                                    <pre>{{ floor.comment_cases.content }}</pre>
                                                </div>
                                            </el-main>
                                            <el-aside
                                                style="width: 30%; margin-left: 20px; display: flex; justify-content: center; align-items: center">
                                                <el-button @click="showComments(floor.id)">查看全部评论</el-button>
                                            </el-aside>
                                        </el-container>
                                    </div>
                                </el-card>
                            </el-card>
                        </div>
                        <div v-loading="loading" element-loading-text="Loading..." />
                    </div>
                </div>

                <div class="right"></div>
            </div>

            <el-dialog v-model="commentsDialogVisible" title="全部评论" width="50%" :draggable="true">
                <div v-for="comment in comments" :key="comment.id">
                    <el-card style="min-height: auto; margin-bottom: 20px">
                        <div class="post_floor-header">
                            <div style="width: 80%">
                                <div style="width: 100%">
                                    <div style="padding-left: 20px">
                                        <el-popover placement="right" width="220" trigger="hover">
                                            <p>昵称：{{ userInfo.name }}</p>
                                            <p>邮箱：{{ userInfo.email }}</p>
                                            <p>个人描述：{{ userInfo.description }}</p>
                                            <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                            <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                            <p>性别：{{ getGender(userInfo.gender) }}</p>
                                            <template v-slot:reference>
                                                <el-link :underline="false" type="primary" style="font-size:20px;"
                                                    @mouseenter="showPopover(comment.cuserId)">
                                                    {{ comment.cuserName }}
                                                </el-link>
                                            </template>
                                        </el-popover>
                                    </div>
                                    <div style="margin-left: 20%">
                                        <span style="font-size: 13px">——发表于 {{ getTimeSubstring(comment.createTime) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="margin-bottom: 5px; font-size: 20px;padding-left: 20px; padding-right: 20px">
                            {{ comment.content }}
                        </div>

                        <div class="clearfix" style="margin-bottom: 20px">
                            <el-tooltip content="举报楼层" placement="bottom">
                                <div style="float: right; margin-left: 10px; margin-right: 20px">
                                    <el-button circle @click="showReportReplyPrompt(1, comment.id)">
                                        <QuestionCircleOutlined style="color: red" />
                                    </el-button>
                                </div>
                            </el-tooltip>
                            <el-tooltip content="删除楼层" placement="bottom">
                                <div style="float: right">
                                    <el-button v-if="comment.is_auth" circle
                                        @click="showDeleteComment(comment.id, open_floor_id)">
                                        <DeleteOutlined style="color: red" />
                                    </el-button>
                                </div>
                            </el-tooltip>
                        </div>
                    </el-card>
                </div>
                <el-form>
                    <el-form-item>
                        <el-input v-model="newCommentBody" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <div class="clearfix">
                    <div style="float: right">
                        <el-button type="primary" @click="addComment(open_floor_id)">评论</el-button>
                    </div>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>


<script>
import { ref, getCurrentInstance } from 'vue'
import PageHeader from "@/components/pc/PCPageHeader.vue";
import global from '@/global'
import { DeleteOutlined, QuestionCircleOutlined, EditOutlined, HeartOutlined, HeartTwoTone } from '@ant-design/icons-vue';
import MyEditor from "@/components/sub_components/QuillEditor.vue";

export default {
    name: "PCPostpage",
    props: ['postID'],

    components: {
        PageHeader,
        DeleteOutlined,
        QuestionCircleOutlined,
        EditOutlined,
        HeartOutlined,
        HeartTwoTone,
        MyEditor
    },

    data() {
        return {
            post: {},

            postDialogVisible: false,
            formPost: {},

            newFloorDialogVisible: false,
            newFloorForm: {
                body: ''
            },

            commentsDialogVisible: false,
            newCommentBody: '',

            comments: [],

            userInfo: {},

            open_floor_id: 0,
        };
    },

    setup() {
        const { proxy } = getCurrentInstance();
        const imageUrl = ref('');
        const floors = ref([]);
        const offset = ref(0);
        const limit = 5;

        const loading = ref(false)

        const id = proxy.$route.params.postID;
        const query_floor_id = proxy.$route.query['floor_id'];
        console.log(query_floor_id)

        const loadLazyFloorsToLayer = () => {
            proxy.$axios.post('/forum/floor/getFloorsForLazy', {
                post_id: id,
                offset_floor_id: query_floor_id,
                limit: 1000000000,
                order: 1
            }, {
                headers: {
                    'token': proxy.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res)

                if (res.data.code === 200) {
                    // 懒加载
                    let size = res.data.data.length
                    if (size > 0) {
                        floors.value = floors.value.concat(res.data.data)
                        offset.value = res.data.data[size - 1].id
                    }
                    else {
                        proxy.$message({
                            message: `您所发评论在第${floors[size - 1].layers}楼`,
                            type: 'success',
                            grouping: true,
                            showClose: true,
                        })
                    }
                    // console.log(floors.value)
                    // console.log(offset.value)
                }
                else {
                    floors.value = []
                    offset.value = 0
                }
            }).catch((error) => {
                console.log(error);
            });
        }

        const loadLazyFloors = () => {
            proxy.$axios.post('/forum/floor/getFloorsForLazy', {
                post_id: id,
                offset_floor_id: offset.value,
                limit: limit,
                order: 0
            }, {
                headers: {
                    'token': proxy.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res)

                if (res.data.code === 200) {
                    // 懒加载
                    let size = res.data.data.length
                    if (size > 0) {
                        floors.value = floors.value.concat(res.data.data)
                        offset.value = res.data.data[size - 1].id
                    }
                    else {
                        proxy.$message({
                            message: '已显示全部楼层',
                            type: 'success',
                            grouping: true,
                            showClose: true,
                        })
                    }
                    // console.log(floors.value)
                    // console.log(offset.value)
                }
                else {
                    floors.value = []
                    offset.value = 0
                }
            }).catch((error) => {
                console.log(error);
            });
        };

        const debounce = (f, delay) => {
            let timer = null
            let loadingTimer = null
            return () => {
                clearTimeout(timer)
                clearTimeout(loadingTimer)

                loadingTimer = setTimeout(() => {
                    loading.value = true
                }, 200)

                timer = setTimeout(() => {
                    f.apply(this, arguments)
                    clearTimeout(loadingTimer)
                }, delay)
            }
        }

        const handleScroll = debounce(() => {
            {
                const windowHeight = window.innerHeight
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
                const distance = scrollHeight - (windowHeight + scrollTop)
                if (distance <= 100) {
                    loadLazyFloors() // 触发加载数据的方法
                    loading.value = false
                }
            }
        }, 1500)

        return {
            imageUrl, floors, limit, loadLazyFloors, handleScroll, loading, loadLazyFloorsToLayer, query_floor_id
        };
    },

    methods: {
        updateContent(data) {
            console.log(data)
            this.formPost.content = data;
        },

        showPopover(user_id) {
            let that = this
            that.$axios.get('/user/getUserById/' + user_id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    that.userInfo = res.data.data
                    // console.log(that.userInfo)
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
            this.getPostDetail()
        },

        getIcon(id) {
            let that = this
            that.$axios.get('/user/getUserById/' + id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                console.log(res)
                if (res.data.code === 200) {
                    that.imageUrl = res.data.data.icon
                }
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
                // console.log(res)
                if (res.data.code === 500) {
                    this.$message({
                        message: '该帖子不存在!',
                        type: "error"
                    })
                    this.$router.push({ path: '/forum' })
                    return
                }

                that.post = res.data.data
                //console.log("getPostDetail()")
                //console.log(res.data.data)
                that.getIcon(that.post.userId);
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
            }).then(() => {
                //console.log(response)
                that.newFloorForm.body = ''
                this.$message({
                    message: '请刷新加载新楼层',
                    type: 'success',
                    grouping: true,
                    showClose: true,
                })
            })
            this.newFloorDialogVisible = false
        },

        showComments(floorID) {
            this.loadAllComments(floorID)
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
                // console.log(res.data)
                if (res.data.code === 200) {
                    that.comments = res.data.data.retComments
                    //console.log("getComments")
                }
                else {
                    that.comments = []
                }
                that.open_floor_id = floorID
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
                    that.$axios.get('/forum/floor/getCommentCaseByFloorIdForLazy/' + floorID, {
                        headers: {
                            'token': that.$cookies.get('user_token')
                        }
                    }).then(res => {
                        let floor = that.floors.find(item => item.id === floorID)
                        if (floor) {
                            floor.comment_cases = res.data.comment_cases
                        }
                    }).catch((err) => console.log(err))
                }
            })
        },

        showDeletePost() {
            this.tokenCheck()
            this.$confirm(
                '确认删除该帖子？',
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
                    // console.log("删除的帖子id为：" + that.post.id)
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
                '确认删除该楼层？',
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
                    // console.log("删除的floor的id为：" + floorId)
                    this.floors = this.floors.filter(item => item.id !== floorId)
                    // console.log(this.floors)
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

        showDeleteComment(commentId, floorID) {
            this.tokenCheck()
            this.$confirm(
                '确认删除该评论？',
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
                    // console.log("删除的comment的id为：" + commentId)
                    this.$message({
                        type: 'info',
                        message: '删除成功',
                    });
                    that.loadAllComments(floorID)
                    that.$axios.get('/forum/floor/getCommentCaseByFloorIdForLazy/' + floorID, {
                        headers: {
                            'token': that.$cookies.get('user_token')
                        }
                    }).then(res => {
                        let floor = that.floors.find(item => item.id === floorID)
                        if (floor) {
                            floor.comment_cases = res.data.comment_cases
                        }
                    }).catch((err) => console.log(err))

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
            this.formPost.title = this.post.title
            this.formPost.content = this.post.content
            //console.log(this.formPost.content)
            this.postDialogVisible = true
        },
        submitEditForm() {
            if (this.formPost.title === '') {
                return this.$message.error("帖子标题不能为空")
            }
            else if (this.formPost.content === '') {
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
                if (res.data.code === 200) {
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
            }
            else {
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
            }).then(() => {
                // console.log(response);
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
            }
            else {
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
        reportReply(reason, type, id) {
            // 执行举报reply的逻辑
            // console.log('举报reply type= ' + type + '，理由为：' + reason);
            let that = this
            that.$axios.post('/forum/report/reportReply', {
                id: id,
                reason: reason,
                type: type
            }, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then(() => {
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
                // return timeString.substring(5, 16);
                return timeString
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
        },

    },

    mounted() {
        this.initPost();
        window.addEventListener('scroll', this.handleScroll)

        if (this.query_floor_id) {
            this.loadLazyFloorsToLayer()
        }
        else {
            this.loadLazyFloors()
        }
    },

    computed: {
        tags() {
            if (this.post.pinNameStr) {
                return this.post.pinNameStr.split(";");
            }
            else {
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
    padding-top: 10px;
    width: 500px;
}

.title h2 {
    margin: 0;
    color: #333;
}


.main {
    display: flex;
    justify-content: space-between;
    margin: 0 15%;
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
    width: 100%;
}

.post_floor-header {
    color: #999;
    margin-bottom: 20px;
    font-size: 18px;

    display: flex;
    justify-content: space-between;
}

.clearfix:after {
    content: '';
    display: block;
    clear: both;
}


/*
    覆盖element-plus自身css
*/
.el-button:focus {
    color: white;
    background: white;
    outline: none;
}

.el-main {
    --el-main-padding: 0px;
}

</style>