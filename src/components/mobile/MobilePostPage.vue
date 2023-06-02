<template>
    <el-container>
        <el-main>
            <van-row>
                <van-col :span="24">
                    <van-row>
                        <van-col :span="6" style="display: flex; align-items: center; justify-content: center">
                            <el-avatar
                                :size="70"
                                shape="square"
                                :src="this.imageUrl"
                                style="user-select: none"
                            >
                            </el-avatar>
                        </van-col>
                        <van-col :span="12" style="padding-top: 5px; display: flex; align-items: center">
                            <div style="padding-top: -5px">
                                <van-row>
                                    <el-popover placement="right" width="220" trigger="hover">
                                        <p>昵称：{{ userInfo.name }}</p>
                                        <p>邮箱：{{ userInfo.email }}</p>
                                        <p>个人描述：{{ userInfo.description }}</p>
                                        <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                        <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                        <p>性别：{{ getGender(userInfo.gender) }}</p>
                                        <template v-slot:reference>
                                            <el-link
                                                :underline="false"
                                                type="primary"
                                                style="font-size: 18px"
                                                @mouseenter="showPopover(post.userId)"
                                            >{{ post.userName }}
                                            </el-link
                                            >
                                        </template>
                                    </el-popover>
                                </van-row>
                                <van-row>
                                    <el-text tag="i">
                                        {{ getTimeSubstring(post.createTime) }}
                                    </el-text>
                                </van-row>
                            </div>
                        </van-col>
                        <van-col :span="6">
                            <el-descriptions :column="1" style="padding-top: 12px">
                                <el-descriptions-item min-width="100px" label="点赞数">
                                    {{ post.thumbsUp }}
                                </el-descriptions-item>
                                <el-descriptions-item min-width="100px" label="访问量">
                                    {{ post.visit }}
                                </el-descriptions-item>
                                <el-descriptions-item min-width="100px" label="楼层数">
                                    {{ post.floorNum }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </van-col>
                    </van-row>
                    <van-row justify="center">
                        <van-col :span="22" :offset="1">
                            <pre class="change-line" style="font-family: Arial, sans-serif;font-size: 2rem;font-weight: bold;
                            color: #333;">{{ post.title }}</pre>
                        </van-col>
                    </van-row>
                    <van-row justify="center">
                        <van-col :span="22" :offset="1">
                            <pre class="change-line"><div v-html="post.content"></div></pre>
                        </van-col>
                    </van-row>
                    <el-divider/>
                    <van-row>
                        <van-col :span="5" style="display: flex; align-items: center; justify-content: center">
                            <el-tag class="tag" style="margin-right: 10px">
                                Tag:{{ _get_pin_type(post.tag) }}
                            </el-tag>
                        </van-col>
                        <van-col :span="18" :offset="1">
                            <div v-if="tags.length > 0">
                                <div v-for="(tag, index) in tags" :key="index"
                                     style="margin-right: 10px; margin-top: 5px; display: inline">
                                    <el-tag size="small" effect="plain" type="success">
                                        {{ tag }}
                                    </el-tag>
                                </div>
                            </div>
                        </van-col>
                    </van-row>
                </van-col>
            </van-row>
            <van-row>
                <van-col :span="16">
                    <el-button v-if="post.is_auth" @click="showDeletePost" circle>
                        <DeleteOutlined style="color: red"/>
                    </el-button>
                    <el-button @click="showReportPostPrompt" circle>
                        <QuestionCircleOutlined style="color: red"/>
                    </el-button>
                    <el-button v-if="post.is_auth" @click="editPost" circle>
                        <EditOutlined/>
                    </el-button>
                    <el-button @click="addLike" circle>
                        <HeartTwoTone v-if="post.has_thumb" style="color: red" twoToneColor="red"/>
                        <HeartOutlined v-else style="color: black"/>
                    </el-button>
                </van-col>
                <van-col :span='8'>
                    <el-button type="primary" plain @click="newFloorDialogVisible = true">回复帖子</el-button>
                </van-col>
            </van-row>
            <van-row style="margin-top: 10%">
                <van-col :span="24">
                    <div v-if="floors.length > 0">
                        <div v-for="floor in floors" :key="floor.id" style="padding-bottom: 20px">
                            <el-card>
                                <van-row>
                                    <van-col :span="19">
                                        <el-popover placement="right" trigger="hover">
                                            <p>昵称：{{ userInfo.name }}</p>
                                            <p>邮箱：{{ userInfo.email }}</p>
                                            <p>个人描述：{{ userInfo.description }}</p>
                                            <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                            <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                            <p>性别：{{ getGender(userInfo.gender) }}</p>
                                            <template v-slot:reference>
                                                <el-link
                                                    :underline="false"
                                                    type="primary"
                                                    style="font-size: 18px"
                                                    @mouseenter="showPopover(floor.userId)"
                                                >{{ floor.userName }}
                                                </el-link
                                                >
                                            </template>
                                        </el-popover>
                                    </van-col>
                                    <van-col :span="5">
                                        <span style="color: #999;font-size: 18px;">{{ floor.layers }}楼</span>
                                    </van-col>
                                </van-row>

                                <van-row>
                                    <van-col :span="24">
                                        <pre style="font-size: 20px" class="change-line">{{ floor.content }}</pre>
                                    </van-col>
                                </van-row>
                                <van-row justify="end">
                                    <span style="font-size: 13px;color: #999">
                                            ——发表于 {{ getTimeSubstring(floor.createTime) }}
                                    </span>
                                </van-row>
                                <van-row>
                                    <van-col :span="8" :offset="1">
                                        <el-button circle @click="showReportReplyPrompt(0, floor.id)">
                                            <QuestionCircleOutlined style="color: red"/>
                                        </el-button>
                                        <el-button v-if="floor.is_auth" circle @click="showDeleteFloor(floor.id)">
                                            <DeleteOutlined style="color: red"/>
                                        </el-button>
                                    </van-col>
                                    <van-col :span="10" :offset="4">
                                        <div v-if="!floor.comment_cases" style="margin-top: 10px;">
                                            <el-button @click="showComments(floor.id)">回复楼层</el-button>
                                        </div>
                                    </van-col>
                                </van-row>

                                <el-card v-if="floor.comment_cases" shadow="never" style="margin-top: 5px">
                                    <van-row>
                                        <van-col :span="15">
                                            <van-row>
                                                <el-popover placement="right" width="220" trigger="hover">
                                                    <p>昵称：{{ userInfo.name }}</p>
                                                    <p>邮箱：{{ userInfo.email }}</p>
                                                    <p>个人描述：{{ userInfo.description }}</p>
                                                    <p>学习阶段：{{ getGrade(userInfo.grade) }}</p>
                                                    <p>校区：{{ getCampus(userInfo.campus) }}</p>
                                                    <p>性别：{{ getGender(userInfo.gender) }}</p>
                                                    <template v-slot:reference>
                                                        <el-link :underline="false" type="primary" style="font-size: 18px"
                                                                 @mouseenter="showPopover(floor.comment_cases.cuserId)">
                                                            {{ floor.comment_cases.cuserName }}
                                                        </el-link>
                                                    </template>
                                                </el-popover>
                                            </van-row>
                                            <van-row>
                                                <pre class="change-line">{{ floor.comment_cases.content }}</pre>
                                            </van-row>
                                        </van-col>
                                        <van-col :span="8" :offset="1" style="display: flex; align-items: center; justify-content: center">
                                            <el-button siz="small" @click="showComments(floor.id)">全部评论</el-button>
                                        </van-col>
                                    </van-row>
                                </el-card>
                            </el-card>
                        </div>
                    </div>

                    <div v-else>
                        <el-card>
                            <van-row justify="center">
                                暂无回复
                            </van-row>
                        </el-card>
                    </div>
                </van-col>
                <van-row></van-row>
                <van-row>
                    <el-pagination v-if="totalFloors > 0" @current-change="handlePageChange" v-model="currentPage"
                                   :page-size="limit" :total="totalFloors" :small="true" :pager-count="5">
                    </el-pagination>
                </van-row>
            </van-row>


            <!--            <van-row>-->
            <!--                <CopyrightICP/>-->
            <!--            </van-row>-->
        </el-main>

        <van-dialog v-model:show="postDialogVisible" :z-index="2000" style="padding: 3% 0" overflow-y: auto
                    :show-cancel-button="true" @confirm="submitEditForm" title="编辑帖子">
            <van-form :model="formPost" style="margin: 20px 0">
                <van-cell-group inset>
                    <van-field v-model="formPost.title" name="名称" label="标题" type="textarea" autosize maxlength="60"
                               :rules="[{ required: true, message: '请填写帖子标题' }]"/>
                    <van-cell title="正文" value=""/>
                    <div>
                        <MyEditor @input="(content) => updateContent(content)" :initialValue="post.content"
                                  :sendData="formPost.content"/>
                    </div>
                </van-cell-group>
            </van-form>
        </van-dialog>

        <el-dialog v-model="newFloorDialogVisible" width="75%">
            <el-form :model="newFloorForm" ref="newFloorForm" label-width="80px">
                <el-form-item label="评论内容">
                    <el-input
                        v-model="newFloorForm.body"
                        type="textarea"
                        maxlength="150"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" @click="addNewFloor">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog v-model="commentsDialogVisible" title="全部评论" width="80%" :draggable="true">
            <div v-for="comment in comments" :key="comment.id">
                <el-card style="min-height: auto; margin-bottom: 20px">
                    <div>
                        <div style="width: 80%">
                            <div style="width: 100%">
                                <div style="padding-left: 20px">
                                    {{ comment.cuserName }}
                                </div>
                                <div style="margin-left: 10%">
                                    <span style="font-size: 10px">
                                        ——发表于 {{ getTimeSubstring(comment.createTime) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <pre class="change-line"
                         style="margin-bottom: 5px;font-size: 20px;padding-left: 20px;padding-right: 20px;">
                        {{ comment.content }}
                    </pre>

                    <div class="clearfix" style="margin-bottom: 20px">
                        <el-tooltip content="举报楼层" placement="bottom">
                            <div style="float: right;margin-left: 10px;margin-right: 20px;margin-bottom: 20px;">
                                <el-button circle @click="showReportReplyPrompt(1, comment.id)">
                                    <QuestionCircleOutlined style="color: red"/>
                                </el-button>
                            </div>
                        </el-tooltip>
                        <el-tooltip content="删除楼层" placement="bottom">
                            <div style="float: right">
                                <el-button v-if="comment.is_auth" circle
                                           @click="showDeleteComment(comment.id, open_floor_id)">
                                    <DeleteOutlined style="color: red"/>
                                </el-button>
                            </div>
                        </el-tooltip>
                    </div>
                </el-card>
            </div>
            <el-form>
                <el-form-item>
                    <el-input v-model="newCommentBody" type="textarea" maxlength="150"/>
                </el-form-item>
            </el-form>
            <van-col :offset="19">
                <el-button type="primary" @click="addComment(open_floor_id)">评论</el-button>
            </van-col>
        </el-dialog>
    </el-container>
</template>


<script>
import {ref, onMounted, getCurrentInstance} from "vue";
import global from "@/global";
import MyEditor from "@/components/sub_components/QuillEditor.vue";
import {
    DeleteOutlined,
    QuestionCircleOutlined,
    EditOutlined,
    HeartOutlined,
    HeartTwoTone,
} from "@ant-design/icons-vue";

export default {
    name: "MobilePostpage",

    components: {
        DeleteOutlined,
        QuestionCircleOutlined,
        EditOutlined,
        HeartOutlined,
        HeartTwoTone,
        MyEditor,
    },

    data() {
        return {
            post: {},

            postDialogVisible: false,
            formPost: {},

            newFloorDialogVisible: false,
            newFloorForm: {
                body: "",
            },

            commentsDialogVisible: false,
            newCommentBody: "",

            comments: [],

            userInfo: {},

            open_floor_id: 0,
        };
    },

    setup() {
        const currentPage = ref(1);
        const totalFloors = ref(0);

        const {proxy} = getCurrentInstance();
        const imageUrl = ref("");
        const floors = ref([]);
        const offset = ref(0);
        const limit = 5;

        const id = proxy.$route.params.postID;

        const loadFloors = (offset) => {
            proxy.$axios
                .post("/forum/floor/getFloors", null, {
                    params: {
                        post_id: id,
                        offset: parseInt(offset.value),
                        limit: parseInt(limit),
                    },
                    headers: {
                        token: proxy.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    //console.log(res)
                    if (res.data.code === 200) {
                        floors.value = res.data.data.retFloors;
                        totalFloors.value = res.data.data.length;
                    }
                    else {
                        floors.value = [];
                        totalFloors.value = 0;
                    }
                })
                .catch((error) => {
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
            imageUrl,
            floors,
            currentPage,
            totalFloors,
            limit,
            handlePageChange,
            loadFloors,
        };
    },

    methods: {
        updateContent(content) {
            this.formPost.content = content;
        },

        showPopover(user_id) {
            let that = this;
            that.$axios
                .get("/user/getUserById/" + user_id, {
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    // console.log(res);
                    if (res.data.code === 200) {
                        that.userInfo = res.data.data;
                        // console.log(that.userInfo);
                    }
                })
                .catch((res) => console.log(res));
        },

        _get_pin_type(pin_type_id) {
            return global.get_pin_type(pin_type_id);
        },

        tokenCheck() {
            if (!this.$cookies.get("user_token")) {
                this.$message({
                    message: "请先登录!",
                    type: "warning",
                });
                this.$router.push({path: "/login"});
            }
        },

        initPost() {
            this.getPostDetail();
        },

        getIcon(id) {
            let that = this;
            that.$axios
                .get("/user/getUserById/" + id, {
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    // console.log(res)
                    if (res.data.code === 200) {
                        that.imageUrl = res.data.data.icon;
                    }
                })
                .catch((res) => console.log(res));
        },

        getPostDetail() {
            let that = this;
            let id = that.$route.params.postID;
            that.$axios
                .post("/forum/post/getPostDetail", null, {
                    params: {
                        post_id: id,
                    },
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    that.post = res.data.data;
                    //console.log("getPostDetail()")
                    //console.log(res.data.data)
                    that.getIcon(that.post.userId);
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        addNewFloor() {
            this.tokenCheck();
            if (this.newFloorForm.content === "") {
                return this.$message.error("楼层正文不能为空");
            }

            let that = this;
            that.$axios
                .post("/forum/floor/addFloor", null, {
                    params: {
                        post_id: that.post.id,
                        floor_content: that.newFloorForm.body,
                    },
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((response) => {
                    //console.log(response)
                    that.newFloorForm.body = "";
                    if (response.data.code === 200) {
                        that.loadFloors(ref(0));
                    }
                });
            this.newFloorDialogVisible = false;
        },

        showComments(floorID) {
            this.loadAllComments(floorID);
            this.commentsDialogVisible = true;
            this.open_floor_id = floorID
        },

        loadAllComments(floorID) {
            let that = this;
            that.$axios
                .post("/forum/comment/getComments", null, {
                    params: {
                        floor_id: floorID,
                        offset: 0,
                        limit: 2147483647, //全加载
                    },
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    // console.log(res.data);
                    if (res.data.code === 200) {
                        that.comments = res.data.data.retComments;
                        //console.log("getComments")
                    }
                    else {
                        that.comments = [];
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        addComment(floorID) {
            this.tokenCheck();
            if (this.newCommentBody === "") {
                return this.$message.error("评论不能为空");
            }

            let that = this;
            that.$axios
                .post("/forum/comment/addComment", null, {
                    params: {
                        c_content: that.newCommentBody,
                        floor_id: floorID,
                        rcomment_id: 0,
                    },
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((response) => {
                    // console.log(response)
                    that.newCommentBody = "";
                    if (response.data.code === 200) {
                        that.loadAllComments(floorID);
                        that.loadFloors(ref(0));
                    }
                });
        },

        showDeletePost() {
            this.tokenCheck();
            this.$confirm("确认删除该post？", "Warning", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.deletePost();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消删除",
                    });
                });
        },
        deletePost() {
            let that = this;

            that.$axios
                .delete("/forum/post/deletePost/" + that.post.id, {
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    if (res.data.code === 200) {
                        // console.log("删除的帖子id为：" + that.post.id);
                        this.$message({
                            type: "info",
                            message: "删除成功",
                        });
                        that.$router.push({path: "/Forum"});
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

        showDeleteFloor(floorId) {
            this.tokenCheck();
            this.$confirm("确认删除该floor？", "Warning", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.deleteFloor(floorId);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消删除",
                    });
                });
        },
        deleteFloor(floorId) {
            let that = this;
            that.$axios
                .delete("/forum/floor/deleteFloor/" + floorId, {
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    if (res.data.code === 200) {
                        // console.log("删除的floor的id为：" + floorId);
                        this.$message({
                            type: "info",
                            message: "删除成功",
                        });
                        that.loadFloors(ref(0));
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

        showDeleteComment(commentId, floorID) {
            this.tokenCheck();
            this.$confirm("确认删除该comment？", "Warning", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.deleteComment(commentId, floorID);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消删除",
                    });
                });
        },
        deleteComment(commentId, floorID) {
            // 执行删除评论的逻辑
            let that = this;
            that.$axios
                .delete("/forum/comment/deleteComment/" + commentId, {
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    if (res.data.code === 200) {
                        // console.log("删除的comment的id为：" + commentId);
                        this.$message({
                            type: "info",
                            message: "删除成功",
                        });
                        that.loadAllComments(floorID);
                        that.loadFloors(ref(0));
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

        editPost() {
            this.tokenCheck();
            this.formPost = Object.assign({}, this.post);
            this.postDialogVisible = true;
        },
        submitEditForm() {
            if (this.formPost.title === "") {
                return this.$message.error("帖子标题不能为空");
            }
            else if (this.formPost.content === "") {
                return this.$message.error("帖子正文不能为空");
            }

            let that = this;
            let id = that.$route.params.postID;
            that.$axios
                .post("/forum/post/changePost", null, {
                    params: {
                        post_id: id,
                        tag: that.formPost.tag,
                        pinIdStr: that.formPost.pinIdStr,
                        title: that.formPost.title,
                        content: that.formPost.content,
                    },
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    //console.log(res)
                    if (res.data.code === 200) {
                        that.getPostDetail();
                    }
                });
            that.postDialogVisible = false;
        },

        showReportPostPrompt() {
            if (!this.$cookies.get("user_token")) {
                this.$message({
                    message: "请先登录!",
                    type: "warning",
                });
                this.$router.push({path: "/login"});
            }
            else {
                this.$prompt("请输入举报理由", "举报帖子", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    inputPlaceholder: "请输入举报理由",
                    inputValidator: (value) => {
                        if (!value) {
                            return "举报理由不能为空";
                        }
                    },
                })
                    .then(({value}) => {
                        this.reportPost(value);
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "取消举报",
                        });
                    });
            }
        },
        reportPost(reason) {
            // 执行举报post的逻辑
            let that = this;
            that.$axios
                .post(
                    "/forum/report/reportPost",
                    {
                        id: that.post.id,
                        reason: reason,
                    },
                    {
                        headers: {
                            token: that.$cookies.get("user_token"),
                        },
                    }
                )
                .then((response) => {
                    // console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        showReportReplyPrompt(type, id) {
            if (!this.$cookies.get("user_token")) {
                this.$message({
                    message: "请先登录!",
                    type: "warning",
                });
                this.$router.push({path: "/login"});
            }
            else {
                this.$prompt("请输入举报理由", "举报回复", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    inputPlaceholder: "请输入举报理由",
                    inputValidator: (value) => {
                        if (!value) {
                            return "举报理由不能为空";
                        }
                    },
                })
                    .then(({value}) => {
                        this.reportReply(value, type, id);
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "取消举报",
                        });
                    });
            }
        },
        reportReply(reason, type, id) {
            // 执行举报reply的逻辑
            // console.log("举报reply type= " + type + "，理由为：" + reason);
            let that = this;
            that.$axios
                .post(
                    "/forum/report/reportReply",
                    {
                        id: id,
                        reason: reason,
                        type: type,
                    },
                    {
                        headers: {
                            token: that.$cookies.get("user_token"),
                        },
                    }
                )
                .then(() => {
                    //console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        addLike() {
            this.tokenCheck();
            let that = this;
            //console.log("初始点赞"+that.post.thumbsUp)
            that.$axios
                .get("/forum/post/addLike/" + that.post.id, {
                    headers: {
                        token: that.$cookies.get("user_token"),
                    },
                })
                .then((res) => {
                    if (res.data.code === 200) {
                        //console.log("点赞成功");
                        that.getPostDetail();
                        //console.log("现在点赞"+that.post.thumbsUp)
                    }
                })
                .catch((res) => console.log(res));
        },

        getTimeSubstring(timeString) {
            // if (timeString) {
            //     return timeString.substring(5, 16);
            // }
            return timeString
        },

        getGrade(value) {
            return value === "1"
                ? "本科"
                : value === "2"
                    ? "硕士"
                    : value === "3"
                        ? "博士"
                        : "";
        },

        getCampus(value) {
            return value === "1" ? "学院路校区" : value === "2" ? "沙河校区" : "";
        },

        getGender(value) {
            return value === 1 ? "女" : value === 0 ? "男" : "";
        },
    },

    mounted() {
        this.initPost();
    },

    computed: {
        tags() {
            if (this.post.pinNameStr) {
                return this.post.pinNameStr.split(";");
            }
            else {
                return [];
            }
        },
    },
};
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.post_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    width: 100%;
}

.van-row {
    margin-bottom: 10px;
}

.box-card {
    width: 100%;
}

.change-line {
    word-wrap: break-word;
    font-family: 'Open Sans', sans-serif;
    white-space: pre-wrap;
    width: 100%;
}

.el-button:focus {
    color: white;
    background: white;
    outline: none;
}

</style>