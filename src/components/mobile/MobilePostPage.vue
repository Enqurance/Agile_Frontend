<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-row>
            <span class="post-title">
              {{ post.title }}
            </span>
          </el-row>
          <el-row>
            <div class="post_content" style="text-align: left; font-size: 20px">
              {{ post.content }}
            </div>
          </el-row>
          <el-row>
            <el-descriptions :column="3">
              <el-descriptions-item min-width="100px" label="点赞数">{{
                post.thumbsUp
              }}</el-descriptions-item>
              <el-descriptions-item min-width="100px" label="访问量">{{
                post.visit
              }}</el-descriptions-item>
              <el-descriptions-item min-width="100px" label="楼层数">{{
                post.floorNum
              }}</el-descriptions-item>
              <el-descriptions-item min-width="200px" label="发布日期">
                {{ getTimeSubstring(post.createTime) }}</el-descriptions-item
              >
            </el-descriptions>
            <span style="margin-top: 2px"> </span>
          </el-row>
          <el-divider />
          <el-row>
            <el-col :span="4">
              <el-avatar
                :size="55"
                shape="square"
                :src="this.imageUrl"
                style="user-select: none"
              >
              </el-avatar>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-tag class="tag" style="margin-right: 10px"
                  >Tag:{{ _get_pin_type(post.tag) }}</el-tag
                >
              </el-row>
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
                    >{{ post.userName }}</el-link
                  >
                </template>
              </el-popover>
            </el-col>
            <el-col :span="12">
              <el-col :span="24">
                <div v-if="tags.length > 0">
                  <div
                    v-for="(tag, index) in tags"
                    :key="index"
                    style="margin-right: 10px; margin-top: 5px; display: inline"
                  >
                    <el-tag size="small" effect="plain" type="success">{{
                      tag
                    }}</el-tag>
                  </div>
                </div>
              </el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-tooltip content="删除帖子" placement="bottom">
            <el-button
              v-if="post.is_auth"
              type="danger"
              @click="showDeletePost"
              circle
            >
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
          <el-tooltip content="点赞帖子" placement="bottom">
            <el-button @click="addLike" circle>
              <HeartTwoTone v-if="post.has_thumb" twoToneColor="#eb2f96" />
              <HeartOutlined v-else />
            </el-button>
          </el-tooltip>
          <el-button type="primary" plain @click="newFloorDialogVisible = true"
            >回复帖子</el-button
          >
        </el-col>
      </el-row>
      <div>
        <el-dialog width="75%" v-model="postDialogVisible">
          <div>
            <el-form>
              <el-form-item label="标题">
                <el-input
                  v-model="formPost.title"
                  autosize
                  maxlength="60"
                ></el-input>
              </el-form-item>
              <el-form-item label="正文">
                <el-input
                  v-model="formPost.content"
                  type="textarea"
                  :rows="6"
                  maxlength="200"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="submitEditForm">确认</el-button>
          </div>
        </el-dialog>
      </div>
      <div>
        <el-dialog v-model="newFloorDialogVisible" width="75%">
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

      <el-row>
        <el-col :span="24">
          <div
            v-for="floor in floors"
            :key="floor.id"
            style="padding-top: 10px"
          >
            <el-card style="min-height: auto">
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
                      <el-link
                        :underline="false"
                        type="primary"
                        style="font-size: 18px"
                        @mouseenter="showPopover(floor.userId)"
                        >{{ floor.userName }}</el-link
                      >
                    </template>
                  </el-popover>
                </div>
                <div class="floor-number">
                  <span style="margin-right: 10px">{{ floor.layers }}楼</span>
                  <el-tooltip content="删除楼层" placement="bottom">
                    <el-button
                      v-if="floor.is_auth"
                      type="danger"
                      plain
                      @click="showDeleteFloor(floor.id)"
                    >
                      <DeleteOutlined />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="举报楼层" placement="bottom">
                    <el-button
                      type="danger"
                      plain
                      @click="showReportReplyPrompt(0, floor.id)"
                    >
                      <QuestionCircleOutlined />
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
              <div style="margin-bottom: 10px; font-size: 20px">
                {{ floor.content }}
              </div>

              <div
                v-if="!floor.comment_cases"
                style="
                  display: flex;
                  justify-content: flex-end;
                  margin-right: 20px;
                "
              >
                <el-button @click="showComments(floor.id)">回复楼层</el-button>
              </div>

              <el-card v-if="floor.comment_cases" shadow="never">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <div>
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
                          @mouseenter="showPopover(floor.comment_cases.cuserId)"
                          >{{ floor.comment_cases.cuserName }}</el-link
                        >
                      </template>
                    </el-popover>
                    <span> ：{{ floor.comment_cases.content }}</span>
                  </div>
                  <el-button @click="showComments(floor.id)"
                    >查看全部评论</el-button
                  >
                </div>
              </el-card>
            </el-card>
          </div>
          <el-row></el-row>
          <el-row>
            <el-pagination
              v-if="totalFloors > 0"
              @current-change="handlePageChange"
              v-model="currentPage"
              :page-size="limit"
              :total="totalFloors"
            >
            </el-pagination>
          </el-row>
        </el-col>
      </el-row>
      <el-row></el-row>
      <el-row>
        <CopyrightICP/>
      </el-row>
    </el-main>
    <el-dialog
      v-model="commentsDialogVisible"
      title="全部评论"
      width="80%"
      :draggable="true"
    >
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

          <div
            style="
              margin-bottom: 5px;
              font-size: 20px;
              padding-left: 20px;
              padding-right: 20px;
            "
          >
            {{ comment.content }}
          </div>

          <div class="clearfix" style="margin-bottom: 20px">
            <el-tooltip content="举报楼层" placement="bottom">
              <div
                style="
                  float: right;
                  margin-left: 10px;
                  margin-right: 20px;
                  margin-bottom: 20px;
                "
              >
                <el-button circle @click="showReportReplyPrompt(1, comment.id)">
                  <QuestionCircleOutlined style="color: red" />
                </el-button>
              </div>
            </el-tooltip>
            <el-tooltip content="删除楼层" placement="bottom">
              <div style="float: right">
                <el-button
                  v-if="comment.is_auth"
                  circle
                  @click="showDeleteComment(comment.id, open_floor_id)"
                >
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
      <el-col :offset="19">
        <el-button type="primary" @click="addComment(open_floor_id)"
          >评论</el-button
        >
      </el-col>
    </el-dialog>
  </el-container>
</template>


<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import global from "@/global";
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

    const { proxy } = getCurrentInstance();
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
          } else {
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
    showPopover(user_id) {
      let that = this;
      that.$axios
        .get("/user/getUserById/" + user_id, {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            that.userInfo = res.data.data;
            console.log(that.userInfo);
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
        this.$router.push({ path: "/login" });
      }
    },

    initPost() {
      console.log("init");
      this.getIcon();
      this.getPostDetail();
    },

    getIcon() {
      let that = this;
      that.$axios
        .get("user/getIcon", {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          this.imageUrl = res.data.data;
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
          console.log(res.data);
          if (res.data.code === 200) {
            that.comments = res.data.data.retComments;
            //console.log("getComments")
          } else {
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
          //console.log(response)
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
            console.log("删除的帖子id为：" + that.post.id);
            this.$message({
              type: "info",
              message: "删除成功",
            });
            that.$router.push({ path: "/Forum" });
          } else {
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
            console.log("删除的floor的id为：" + floorId);
            this.$message({
              type: "info",
              message: "删除成功",
            });
            that.loadFloors(ref(0));
          } else {
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
            console.log("删除的comment的id为：" + commentId);
            this.$message({
              type: "info",
              message: "删除成功",
            });
            that.loadAllComments(floorID);
            that.loadFloors(ref(0));
          } else {
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
      } else if (this.formPost.content === "") {
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
        this.$router.push({ path: "/login" });
      } else {
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
          .then(({ value }) => {
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
          console.log(response);
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
        this.$router.push({ path: "/login" });
      } else {
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
          .then(({ value }) => {
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
      console.log("举报reply type= " + type + "，理由为：" + reason);
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
      if (timeString) {
        return timeString.substring(5, 16);
      }
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
      } else {
        return [];
      }
    },
  },
};
</script>
    
<style scoped>
.title h2 {
  margin: 0;
  color: #333;
}

.post-title {
  font-family: Arial, sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.post_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  width: 100%;
}

.post_floor-header {
  color: #999;
  margin-bottom: 10px;
  font-size: 18px;

  display: flex;
  justify-content: space-between;
}

.el-row {
  margin-bottom: 10px;
}
</style>