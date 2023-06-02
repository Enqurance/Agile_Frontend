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
      <el-row>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          style="width: 90%"
        >
          <el-menu-item index="1" @click="Index = '1'">我收到的</el-menu-item>
          <div class="flex-grow" />
          <el-menu-item index="2" @click="Index = '2'">我发起的</el-menu-item>
        </el-menu>
      </el-row>
      <div v-if="this.Index === '1'">
        <el-row>
          <el-button type="primary" @click="readAllRev()"> 全部已读</el-button>
          <el-button type="danger" @click="deleteRevDialog = true">
            全部删除</el-button
          >
        </el-row>
        <el-scrollbar>
          <div v-if="revs.length === 0">
            <el-empty description="暂时还没有消息" />
          </div>
          <div v-for="rev in revs" :key="rev.id">
            <el-row>
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <el-col :span="16">
                      <!-- <div v-if="rev.read === false" style="float: right">
                        <el-icon>
                          <Warning />
                        </el-icon>
                      </div>
                      <el-icon style="float: right">
                        <circle-close
                          @click="rev.deleteDialog = true"
                        ></circle-close>
                      </el-icon> -->
                      <pre
                        style="
                          word-wrap: break-word;
                          font-family: 'Open Sans', sans-serif;
                          white-space: pre-wrap;
                          width: 100%;
                        "
                      ><div class="for-pre" @click="clickMsg(rev)">{{ rev.title }}</div></pre>
                    </el-col>
                    <el-col :span="6" :offset="2">
                      <el-button
                        v-if="rev.content"
                        type="primary"
                        @click="readDetail(rev)"
                      >
                        查看详情
                      </el-button>
                    </el-col>
                  </div>
                </template>
                <el-row>
                  <span> 内容：{{ rev.content }} </span>
                </el-row>
                <el-row>
                  <el-text> 消息时间：{{ rev.time }} </el-text>
                </el-row>
              </el-card>
            </el-row>
            <el-dialog v-model="rev.detail" title="消息详情" width="80%" center>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="rev.detail = false">关闭</el-button>
                </span>
              </template>
            </el-dialog>
          </div>
        </el-scrollbar>
        <el-dialog v-model="deleteRevDialog" center>
          <div style="text-align: center">
            <el-text tag="b" style="color: black; font-size: 15px">
              您确定删除所有消息吗？
            </el-text>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button
                style="margin-left: 50%"
                @click="deleteRevDialog = false"
                >取消</el-button
              >
              <el-button type="primary" @click="delAllRev()">确认</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
      <div v-if="this.Index === '2'">
        <el-row>
          <el-button type="primary" @click="readAllSnd()"> 全部已读</el-button>
          <el-button type="danger" @click="deleteSndDialog = true">
            全部删除</el-button
          >
        </el-row>
        <el-dialog v-model="deleteSndDialog" center>
          <div style="text-align: center">
            <el-text tag="b" style="color: black; font-size: 15px">
              您确定删除所有消息吗？
            </el-text>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button
                style="margin-left: 50%"
                @click="deleteSndDialog = false"
                >取消</el-button
              >
              <el-button type="primary" @click="delAllSnd()">确认</el-button>
            </div>
          </template>
        </el-dialog>

        <el-scrollbar>
          <div v-if="snds.length === 0">
            <el-empty description="暂时还没有消息" />
          </div>
          <div v-for="snd in snds" :key="snd.id">
            <el-row>
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <el-col>
                      <!-- <el-row>
                      <el-icon style="float: right">
                        <circle-close
                          @click="snd.deleteDialog = true"
                        ></circle-close>
                      </el-icon>
                      <div v-if="snd.read === false" style="float: right">
                        <el-icon>
                          <Warning />
                        </el-icon>
                      </div>
                    </el-row> -->
                      <el-row>
                        <pre
                          style="
                            word-wrap: break-word;
                            font-family: 'Open Sans', sans-serif;
                            white-space: pre-wrap;
                            width: 100%;
                          "
                        ><div class="for-pre" @click="clickMsg(snd)">{{ snd.title }}</div></pre>
                      </el-row>
                      <el-row>
                        <el-text>
                          {{ snd.time }}
                        </el-text>
                      </el-row>
                    </el-col>
                  </div>
                </template>
                <div v-if="snd.content">
                  {{ snd.content }}
                </div>
                <div v-else>暂无详情</div>
              </el-card>
              <el-dialog
                v-model="snd.detail"
                title="消息详情"
                width="80%"
                center
              >
                <span style="text-align: center">
                  {{ snd.content }}
                </span>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="snd.detail = false">关闭</el-button>
                  </span>
                </template>
              </el-dialog>
            </el-row>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
  <el-row></el-row>
  <el-row></el-row>
  <el-row>
    <CopyrightICP />
  </el-row>
</template>

<script>
import { CircleClose, Warning } from "@element-plus/icons-vue";
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
  name: "MyMessage_Mobile",
  components: {
    // CircleClose,
    // Warning,
    CopyrightICP,
  },
  data() {
    return {
      Index: "1",
      activeIndex: "1",
      revs: [],
      snds: [],

      deleteRevDialog: false,
      deleteSndDialog: false,
    };
  },
  methods: {
    clickMsg(msg) {
      this.readMsg(msg);
      if (msg.examine_id !== null && msg.examine_id !== 0) {
        this.$router.push("/Administrator");
      } else if (msg.post_id !== null && msg.post_id !== 0) {
        if (msg.floor_id !== null && msg.floor_id !== 0) {
          this.$router.push({ path: "/Forum/" + msg.post_id });
        } else {
          this.$router.push({ path: "/Forum/" + msg.post_id });
        }
      }
    },
    deleteMessage(msg) {
      let that = this;
      msg.deleteDialog = false;
      // console.log(msg);
      that.$axios
        .delete("/InfoPage/MyMessage/deleteMessage/" + msg.id, {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            // console.log("删除的帖子id为：" + msg.id)
            this.$message({
              type: "info",
              message: "删除成功",
            });
            this.queryAllSnd();
            this.queryAllRev();
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => console.log(res));
    },
    readMsg(msg) {
      let that = this;
      // console.log(msg);
      that.$axios
        .post(
          "/InfoPage/MyMessage/readMessageById",
          {
            m_id: msg.id,
          },
          {
            headers: {
              token: that.$cookies.get("user_token"),
            },
          }
        )
        .then((res) => {
          //console.log(res)
          if (res.data.code === 200) {
            msg.read = true;
            // console.log("read success")
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        });
    },
    readDetail(msg) {
      // console.log(msg);
      msg.detail = true;
      msg.read = true;
    },
    queryAllRev() {
      let that = this;
      that.$axios
        .get("/InfoPage/MyMessage/getReceiveMessage", {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          // console.log(res)
          if (res.data.code === 200) {
            // console.log("get rev success")
            this.revs = res.data.data;
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        });
    },
    queryAllSnd() {
      let that = this;
      that.$axios
        .get("/InfoPage/MyMessage/getSendMessage", {
          headers: {
            token: that.$cookies.get("user_token"),
          },
        })
        .then((res) => {
          // console.log(res)
          if (res.data.code === 200) {
            console.log("get snd success");
            this.snds = res.data.data;
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        });
    },

    readAllRev() {
      let that = this;
      // console.log(that.$cookies.get('user_token'));
      that.$axios
        .post(
          "/InfoPage/MyMessage/readAllReceiveMessage",
          {},
          {
            headers: {
              token: that.$cookies.get("user_token"),
            },
          }
        )
        .then((res) => {
          // console.log(res)
          if (res.data.code === 200) {
            this.$message({
              type: "info",
              message: "操作成功",
            });
            this.queryAllRev();
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => console.log(res));
    },
    delAllRev() {
      let that = this;
      that.deleteRevDialog = false;
      // console.log(msg);
      that.$axios
        .post(
          "/InfoPage/MyMessage/deleteAllReceiveMessage",
          {},
          {
            headers: {
              token: that.$cookies.get("user_token"),
            },
          }
        )
        .then((res) => {
          if (res.data.code === 200) {
            // console.log("删除的帖子id为：" + msg.id)
            this.$message({
              type: "info",
              message: "操作成功",
            });
            this.revs = [];
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => console.log(res));
    },
    readAllSnd() {
      let that = this;
      // console.log(msg);
      that.$axios
        .post(
          "/InfoPage/MyMessage/readAllSendMessage",
          {},
          {
            headers: {
              token: that.$cookies.get("user_token"),
            },
          }
        )
        .then((res) => {
          if (res.data.code === 200) {
            // console.log("删除的帖子id为：" + msg.id)
            this.$message({
              type: "info",
              message: "操作成功",
            });
            this.queryAllSnd();
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => console.log(res));
    },
    delAllSnd() {
      let that = this;
      that.deleteSndDialog = false;
      // console.log(msg);
      that.$axios
        .post(
          "/InfoPage/MyMessage/deleteAllSendMessage",
          {},
          {
            headers: {
              token: that.$cookies.get("user_token"),
            },
          }
        )
        .then((res) => {
          if (res.data.code === 200) {
            // console.log("删除的帖子id为：" + msg.id)
            this.$message({
              type: "info",
              message: "操作成功",
            });
            this.snds = [];
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => console.log(res));
    },
  },
  mounted() {
    this.queryAllRev();
    this.queryAllSnd();
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

.for-pre {
  font-weight: bold;
  font-size: 20px;
  color: #5d478b;
}
</style>