<template>
  <div
      style="padding-left: 10%;padding-top:10%;background: rgb(246,246,246);width: 90%">
    <div style="width: 95%">
      <div style="margin-bottom: 3%;font-size: 20px;">
        我的回复
        <!--      <el-button style="margin-left: 40%" size="large" type="primary">-->
        <!--        创建-->
        <!--      </el-button>-->
      </div>
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          style="width: 90%;"
      >
        <el-menu-item index="1" @click="Index='1'">我收到的</el-menu-item>
        <div class="flex-grow"/>
        <el-menu-item index="2" @click="Index='2'">我发起的</el-menu-item>
      </el-menu>
      <div v-if="this.Index==='1'">
        <ul class="infinite-list" style="overflow: auto;display: inline-block;width: 100%">
          <div v-if="revs.length === 0">
            <el-empty description="暂时还没有消息"/>
          </div>
          <div v-for="rev in revs" :key="rev.id"
               style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 90%;height: 120px ">
            <div v-if="rev.read===false" style="float: right;padding-top: 50px">
              <el-icon>
                <Warning/>
              </el-icon>
            </div>

            <h3 style="padding: 0 20px;font-size:18px;height:50px;width:80%;overflow: hidden;"
                @click="clickMsg(rev)">
              {{ rev.title }}
            </h3>
            <p style="padding: 0 20px;font-size:16px;height:20px;width:70%;overflow: hidden;display: inline-block">
              {{ rev.time }}
            </p>
            <el-button style="float: right; display: inline-block" type="danger" size="small"
                       @click="rev.deleteDialog=true">
              删除
            </el-button>
            <el-dialog v-model="rev.detail" title="消息详情" width="80%" center>
            <span style="text-align: center">
              {{ rev.content }}
            </span>

              <template #footer>
              <span class="dialog-footer">
                <el-button @click="rev.detail = false">关闭</el-button>
              </span>
              </template>
            </el-dialog>
          </div>
        </ul>
      </div>
      <div v-if="this.Index==='2'">
        <ul class="infinite-list" style="overflow: auto;display: inline-block;width: 97%">
          <div v-if="snds.length === 0">
            <el-empty description="暂时还没有消息"/>
          </div>
          <div v-for="snd in snds" :key="snd.id"
               style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 90%;height: 120px ">
            <div v-if="snd.read===false" style="float: right;padding-top: 50px">
              <el-icon>
                <Warning/>
              </el-icon>
            </div>

            <h3 style="padding: 0 20px;font-size:18px;height:50px;width:80%;overflow: hidden;"
                @click="clickMsg(snd)">
              {{ snd.title }}
            </h3>
            <p style="padding: 0 20px;font-size:16px;height:20px;width:70%;overflow: hidden;display: inline-block">
              {{ snd.time }}
            </p>
            <el-button style="float: right; display: inline-block" type="danger" size="small"
                       @click="snd.deleteDialog=true">
              删除
            </el-button>
            <el-dialog v-model="snd.detail" title="消息详情" width="80%" center>
            <span style="text-align: center">
              {{ snd.content }}
            </span>

              <template #footer>
              <span class="dialog-footer">
                <el-button @click="snd.detail = false">关闭</el-button>
              </span>
              </template>
            </el-dialog>
          </div>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>

import {Warning} from "@element-plus/icons-vue";

export default {
  name: "MyMessage_Mobile",
  components: {Warning},
  data() {
    return {
      Index: '1',
      activeIndex: '1',
      revs: [

      ],
      snds: [

      ],
    }
  },
  methods: {
    clickMsg(msg) {
      this.readMsg(msg);
      if (msg.examine_id !== null && msg.examine_id !== 0) {
        this.$router.push('/Administrator');
      } else if (msg.post_id !== null && msg.post_id !== 0) {
        if (msg.floor_id !== null && msg.floor_id !== 0) {
          this.$router.push({path: '/Forum/' + msg.post_id});
        } else {
          this.$router.push({path: '/Forum/' + msg.post_id});
        }
      } else {
        if (msg.content === null) {
          msg.content = msg.title;
        }
        msg.detail = true;
      }
    },
    deleteMessage(msg) {
      let that = this
      msg.deleteDialog = false;
      console.log(msg);
      that.$axios.delete('/InfoPage/MyMessage/deleteMessage/' + msg.id, {
        headers: {
          'token': that.$cookies.get('user_token')
        }
      }).then((res) => {
        if (res.data.code === 200) {
          console.log("删除的帖子id为：" + msg.id)
          this.$message({
            type: 'info',
            message: '删除成功',
          });
          this.queryAllSnd();
          this.queryAllRev();
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch((res) => console.log(res))
    },
    readMsg(msg) {
      let that = this;
      console.log(msg);
      that.$axios.post('/InfoPage/MyMessage/readMessageById', {
        m_id: msg.id
      }, {
        headers: {
          'token': that.$cookies.get('user_token')
        }
      }).then((res) => {
        //console.log(res)
        if (res.data.code === 200) {
          msg.read = true;
          console.log("read success")
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    queryAllRev() {
      let that = this
      that.$axios.get('/InfoPage/MyMessage/getReceiveMessage', {
        headers: {
          'token': that.$cookies.get('user_token')
        }

      }).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          console.log("get rev success")
          this.revs = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    queryAllSnd() {
      let that = this
      that.$axios.get('/InfoPage/MyMessage/getSendMessage', {
        headers: {
          'token': that.$cookies.get('user_token')
        }

      }).then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          console.log("get snd success")
          this.snds = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
  },
  mounted() {
    this.queryAllRev();
    this.queryAllSnd();

  }
}
</script>

<style scoped>
.infinite-list {
  height: 360px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: inline-block;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 0;
  color: var(--el-color-primary);
}
</style>