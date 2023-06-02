<template>
  <el-row>
    <el-col :span="22" :offset="1">
      <el-row>
        <div
          style="
            margin-top: 3%;
            margin-left: %2;
            font-size: 24px;
            font-weight: bold;
          "
        >
          我的帖子
        </div>
      </el-row>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
      >
        <el-menu-item index="1" @click="Index = '1'">所有帖子</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="2" @click="Index = '2'">待整改帖子</el-menu-item>
      </el-menu>
      <el-row></el-row>
      <div v-if="this.Index === '1'">
        <el-scrollbar>
          <div v-if="posts.length === 0">
            <el-empty description="暂时还没有贴子" />
          </div>
          <div v-for="post in posts" :key="post.id">
            <el-row>
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <el-col :span="16"
                      ><div style="font-weight: bold; font-size: 20px">
                        {{ post.title }}
                      </div>
                    </el-col>
                    <el-col :span="6" :offset="2">
                      <el-button
                        type="danger"
                        @click="post.deleteDialog = true"
                      >
                        删除
                      </el-button>
                    </el-col>
                  </div>
                  <el-dialog
                    v-model="post.deleteDialog"
                    title="删除帖子"
                    width="80%"
                    center
                  >
                    <span style="text-align: center">
                      你确定要删除这个帖子吗？相关的评论也将被删除。
                    </span>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="post.deleteDialog = false"
                          >取消</el-button
                        >
                        <el-button type="primary" @click="deletePost(post)">
                          确认
                        </el-button>
                      </span>
                    </template>
                  </el-dialog>
                </template>
                <el-row @click="browsePost(post.id)">
                  <pre class="change-line">帖子内容：
                    <div v-html="post.content"></div></pre>
                </el-row>
                <el-row @click="browsePost(post.id)">
                  <div>
                    <el-icon>
                      <ChatRound />
                    </el-icon>
                    {{ post.floor_num }}
                  </div>
                </el-row>
              </el-card>
            </el-row>
          </div>
        </el-scrollbar>
      </div>
      <div v-if="this.Index === '2'">
        <el-scrollbar>
          <div v-if="posts.length === 0">
            <el-empty description="暂时还没有贴子" />
          </div>
          <div v-for="post in bad_posts" :key="post.id">
            <el-row>
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <el-col :span="12">
                      <div style="font-weight: bold; font-size: 20px">
                        {{ post.title }}
                      </div>
                    </el-col>
                    <el-col :span="10" :offset="2">
                      <el-button
                        type="danger"
                        @click="post.deleteDialog = true"
                      >
                        删除
                      </el-button>
                      <el-button type="primary" @click="editInfo(post)">
                        整改
                      </el-button>
                    </el-col>
                  </div>
                </template>
                <el-row @click="browsePost(post.id)">
                  <pre class="change-line">帖子内容：
                  <div v-html="post.content"></div></pre>
                </el-row>
                <el-row>
                  <el-button @click="post.reasonDialog = true">
                    查看原因</el-button
                  >
                  <el-dialog
                    v-model="post.reasonDialog"
                    title="整改原因"
                    width="75%"
                    center
                  >
                    <span style="text-align: center">
                      {{ post.reason }}
                    </span>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="post.reasonDialog = false"
                          >关闭</el-button
                        >
                      </span>
                    </template>
                  </el-dialog>
                </el-row>
              </el-card>
            </el-row>
            <el-dialog
              v-model="post.changeDialog"
              title="整改帖子"
              width="80%"
              center
            >
              <el-row>帖子标题</el-row>
              <el-row
                ><el-input
                  v-model="post.new_title"
                  type="textarea"
                  placeholder="Please input"
              /></el-row>
              <div style="margin: 20px 0" />
              <el-row>帖子内容</el-row>
              <el-row>
                <el-input
                  v-model="post.new_content"
                  type="textarea"
                  placeholder="Please input"
                />
              </el-row>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="post.changeDialog = false">取消</el-button>
                  <el-button type="primary" @click="changePost(post)">
                    确认
                  </el-button>
                </span>
              </template>
            </el-dialog>

            <el-dialog
              v-model="post.deleteDialog"
              title="删除帖子"
              width="30%"
              center
            >
              <span style="text-align: center">
                你确定要删除这个帖子吗？相关的评论也将被删除。
              </span>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="post.deleteDialog = false">取消</el-button>
                  <el-button type="primary" @click="deletePost(post)">
                    确认
                  </el-button>
                </span>
              </template>
            </el-dialog>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <CopyrightICP />
  </el-row>
  <el-row></el-row>
  <el-row></el-row>
  <el-row> </el-row>
</template>

<script>
import { ChatRound } from "@element-plus/icons-vue";
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
  name: "MyPost_Mobile",
  components: {
    ChatRound,
    CopyrightICP,
  },
  data() {
    return {
      posts: [],
      bad_posts: [],
      activeIndex: "1",
      Index: "1",
    };
  },
  methods: {
    deletePost(post) {
      let that = this;
      post.deleteDialog = false;
      console.log(post);
      that.$axios
        .delete("/forum/post/deletePost/" + post.id, {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            console.log("删除的帖子id为：" + post.id);
            this.$message({
              type: "info",
              message: "删除成功",
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => console.log(res));
    },
    editInfo(post) {
      post.changeDialog = true;
      post.new_title = post.title;
      post.new_content = post.content;
    },
    queryAllPost() {
      let that = this;
      that.$axios
        .get("/InfoPage/MyPost/getMyAllPost", {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            console.log("get post success");
            this.posts = res.data.data;
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        });
    },
    queryBadPost() {
      let that = this;
      that.$axios
        .get("/InfoPage/MyPost/getMyBadPost", {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          // console.log(res)
          if (res.data.code === 200) {
            console.log("get bad post success");
            this.bad_posts = res.data.data;
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        });
    },
    browsePost(id) {
      // 记得改
      this.$router.push({ path: "/Forum/" + id });
    },
    changePost(post) {
      post.changeDialog = false;
      let that = this;
      that.$axios
        .post(
          "/InfoPage/MyPost/changePostById",
          {
            post_id: post.id,
            new_title: post.new_title,
            new_content: post.new_content,
          },
          {
            headers: {
              token: that.$cookies.get("user_token"),
            },
          }
        )
        .then((res) => {
          // console.log(res)
          if (res.data.code === 200) {
            console.log("change success");
            this.$message({
              message: "已提交整改，请耐心等待",
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        });
    },
  },
  mounted() {
    this.queryAllPost();
    this.queryBadPost();
  },
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 100%;
}

.change-line {
  word-wrap: break-word;
  font-family: "Open Sans", sans-serif;
  white-space: pre-wrap;
  width: 100%;
}
</style>