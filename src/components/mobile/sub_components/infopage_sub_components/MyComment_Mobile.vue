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
          我的回复
        </div>
      </el-row>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
      >
        <el-menu-item index="1" @click="Index = '1'">我的楼层</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="2" @click="Index = '2'">我的评论</el-menu-item>
      </el-menu>
      <el-row></el-row>
      <div v-if="this.Index === '1'">
        <el-scrollbar>
          <div v-if="floors.length === 0">
            <el-empty description="暂时还没有楼层" />
          </div>
          <div v-for="floor in floors" :key="floor.id">
            <el-row>
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <el-col :span="16">
                      <pre
                        style="
                          word-wrap: break-word;
                          font-family: 'Open Sans', sans-serif;
                          white-space: pre-wrap;
                          width: 100%;
                        "
                      ><div style="font-weight: bold;font-size: 20px" @click="browseFloor(floor.post_id)">{{ floor.title }}</div></pre>
                    </el-col>
                    <el-col :span="6" :offset="2">
                      <el-button
                        type="danger"
                        @click="floor.deleteDialog = true"
                      >
                        删除
                      </el-button>
                    </el-col>
                  </div>
                </template>
                <el-row>
                  <span> 内容：{{ floor.content }} </span>
                </el-row>
                <el-row>
                  <el-text> 楼层：{{ floor.floor }} </el-text>
                </el-row>
                <el-dialog
                  v-model="floor.deleteDialog"
                  title="删除楼层"
                  width="80%"
                  center
                >
                  <span style="text-align: center">
                    你确定要删除这个楼层吗？
                  </span>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="floor.deleteDialog = false"
                        >取消</el-button
                      >
                      <el-button type="primary" @click="deleteFloor(floor)">
                        确认
                      </el-button>
                    </span>
                  </template>
                </el-dialog>
              </el-card>
            </el-row>
          </div>
        </el-scrollbar>
      </div>
      <div v-if="this.Index === '2'">
        <el-scrollbar>
          <div v-if="comments.length === 0">
            <el-empty description="暂时还没有评论" />
          </div>
          <div v-for="comment in comments" :key="comment.id">
            <el-row>
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <el-col :span="16">
                      <pre
                        style="
                          word-wrap: break-word;
                          font-family: 'Open Sans', sans-serif;
                          white-space: pre-wrap;
                          width: 100%;
                        "
                      ><div style="font-weight: bold;font-size: 20px" @click="browseComment(comment.post_id)">{{ comment.title }}</div></pre>
                    </el-col>
                    <el-col :span="6" :offset="2">
                      <el-button
                        type="danger"
                        @click="comment.deleteDialog = true"
                      >
                        删除
                      </el-button>
                    </el-col>
                  </div>
                </template>
                <el-row>
                  <span> 内容：{{ comment.content }}</span>
                </el-row>
                <el-row>
                  <el-text> 回复楼层：{{ comment.floor }} </el-text>
                </el-row>
                <el-dialog
                  v-model="comment.deleteDialog"
                  title="删除评论"
                  width="80%"
                  center
                >
                  <span style="text-align: center">
                    你确定要删除这个评论吗？
                  </span>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="comment.deleteDialog = false"
                        >取消</el-button
                      >
                      <el-button type="primary" @click="deleteComment(comment)">
                        确认
                      </el-button>
                    </span>
                  </template>
                </el-dialog>
              </el-card>
            </el-row>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
  <el-row></el-row>
  <el-row></el-row>
  <el-row><CopyrightICP /></el-row>
</template>

<script>
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
  name: "MyComment_Mobile",
  components: {
    CopyrightICP,
  },
  data() {
    return {
      Index: "1",
      activeIndex: "1",
      comments: [],
      floors: [],
    };
  },
  methods: {
    deleteComment(comment) {
      // 执行删除评论的逻辑
      let that = this;
      comment.deleteDialog = false;
      that.$axios
        .delete("/forum/comment/deleteComment/" + comment.id, {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            console.log("删除的comment的id为：" + comment.id);
            this.$message({
              type: "info",
              message: "删除成功",
            });
            this.queryAllComment();
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => console.log(res));
      console.log("删除评论ID为" + comment.id);
    },
    deleteFloor(floor) {
      let that = this;
      floor.deleteDialog = false;
      that.$axios
        .delete("/forum/floor/deleteFloor/" + floor.id, {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            console.log("删除的floor的id为：" + floor.id);
            this.$message({
              type: "info",
              message: "删除成功",
            });
            this.queryAllFloor();
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => console.log(res));
    },
    queryAllComment() {
      let that = this;
      that.$axios
        .get("/InfoPage/MyComment/getMyAllComment", {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          // console.log(res)
          if (res.data.code === 200) {
            console.log("get comment success");
            this.comments = res.data.data;
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        });
    },
    queryAllFloor() {
      let that = this;
      that.$axios
        .get("/InfoPage/MyFloor/getMyAllFloor", {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          // console.log(res)
          if (res.data.code === 200) {
            console.log("get comment success");
            this.floors = res.data.data;
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        });
    },
    browseComment(id) {
      // 记得改
      this.$router.push({ path: "/Forum/" + id });
    },
    browseFloor(id) {
      // 记得改
      this.$router.push({ path: "/Forum/" + id });
    },
  },
  mounted() {
    this.queryAllComment();
    this.queryAllFloor();
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
</style>