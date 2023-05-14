<template>
  <div
      style="padding: 5% 10% 15% 20%;background: rgb(246,246,246); word-wrap: break-word; word-break: normal">
    <div style="padding-left: 5%;font-size: 20px;width:400px;display: inline-block">
      <div style="height: 80px">
        我收到的
      </div>

      <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto;display: inline-block">
        <div v-if="revs.length === 0">
          <el-empty description="暂时还没有消息"/>
        </div>
        <div v-for="rev in revs" :key="rev.id"
             style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 360px;height: 120px ">
          <div v-if="rev.read===false" style="float: right;padding-top: 50px">
            <el-icon>
              <Warning/>
            </el-icon>
          </div>

          <h3 style="padding: 0 20px;font-size:20px;height:50px;width:300px;overflow: hidden;"
              @click="clickMsg(rev)">
            {{ rev.title }}
          </h3>
          <p style="padding: 0 20px;font-size:16px;height:20px;width:300px;overflow: hidden;">
            {{ rev.time }}
          </p>
          <el-dialog v-model="rev.detail" title="消息详情" width="30%" center>
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
    <div style="padding-left: 5%;font-size: 20px;width:400px;display: inline-block">
      <div style="height: 80px">
        我发起的
      </div>

      <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto;display: inline-block">
        <div v-if="snds.length === 0">
          <el-empty description="暂时还没有消息"/>
        </div>
        <div v-for="snd in snds" :key="snd.id"
             style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 360px;height: 120px ">
          <div v-if="snd.read===false" style="float: right;padding-top: 50px">
            <el-icon>
              <Warning/>
            </el-icon>
          </div>

          <h3 style="padding: 0 20px;font-size:20px;height:50px;width:300px;overflow: hidden;"
              @click="clickMsg(snd)">
            {{ snd.title }}
          </h3>
          <p style="padding: 0 20px;font-size:16px;height:20px;width:300px;overflow: hidden;">
            {{ snd.time }}
          </p>
          <el-dialog v-model="snd.detail" title="消息详情" width="30%" center>
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

</template>

<script>

import {Warning} from "@element-plus/icons-vue";

export default {
  name: "MyMessage",
  components: {Warning},
  data() {
    return {
      revs: [
        {
          id: 123,
          title: "[消息]这个消息不能跳转，点击查看详情",
          content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
          time: "2023-5-9 22:07",
          read: false,
          post_id: null,
          floor_id:null,
          examine_id:null,
        },
        {
          id: 12,
          title: "[消息]这是一个已读消息，点击查看详情",
          content: "看过了看过了看过了看过了看过了看过了看过了看过了看过了看过了看过了看过了看过了",
          time: "2023-5-10 10:06",
          read: true,
          post_id: null,
          floor_id:null,
          examine_id:null,
        },
        {
          id: 1,
          title: "[消息]这个消息跳转到审核界面",
          content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
          time: "2023-5-10 10:06",
          read: true,
          post_id: null,
          floor_id:null,
          examine_id:1,
        },
        {
          id: 2,
          title: "[消息]这个消息跳转到帖子",
          content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
          time: "2023-5-10 10:06",
          read: true,
          post_id: 3,
          floor_id:null,
          examine_id:null,
        },
        {
          id: 3,
          title: "[消息]这个消息跳转到楼层",
          content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
          time: "2023-5-10 10:06",
          read: true,
          post_id: 3,
          floor_id:2,
          examine_id:null,
        },
      ],
      snds: [
        {
          id: 2123,
          title: "[消息]这个消息不能跳转，点击查看详情",
          content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
          time: "2023-5-9 22:07",
          read: false,
          post_id: null,
          floor_id:null,
        },
        {
          id: 1233,
          title: "[消息]这是一个已读消息，点击查看详情",
          content: "看过了看过了看过了看过了看过了看过了看过了看过了看过了看过了看过了",
          time: "2023-5-10 10:06",
          read: true,
          post_id: null,
          floor_id:null,
        },
        {
          id: 233,
          title: "[消息]这个消息跳转到帖子",
          content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
          time: "2023-5-10 10:06",
          read: true,
          post_id: 3,
          floor_id:null,
        },
        {
          id: 333,
          title: "[消息]这个消息跳转到楼层",
          content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
          time: "2023-5-10 10:06",
          read: true,
          post_id: 3,
          floor_id:2,
        },
      ],
    }
  },
  methods: {
    clickMsg(msg) {
      this.readMsg(msg);
      if(msg.examine_id!=null)
      {
        this.$router.push('shenghe');
      }
      else if(msg.post_id!=null)
      {
        if(msg.floor_id!=null)
        {
          this.$router.push('louceng');
        }
        else {
          this.$router.push('tiezi');
        }
      }
      else {
        msg.detail = true;
      }
    },
    readMsg(msg) {
      let that = this;
      that.$axios.post('/InfoPage/MyMessage/readMessageById', {
        msg_id: msg.id
      }, {
        headers: {
          'token': that.$cookies.get('user_token')
        }
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
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
        // console.log(res)
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
  margin: 30px;
  color: var(--el-color-primary);
}
</style>