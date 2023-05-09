<template>
  <div
      style="padding: 120px 400px 60px 400px;background: rgb(246,246,246); min-height: 557px; word-wrap: break-word; word-break: normal">
    <div style="margin-bottom: 30px;font-size: 30px">
      我的帖子
      <el-button style="margin-left: 400px" size="large" type="primary">
        创建
      </el-button>
    </div>

    <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
      <div v-if="posts.length === 0">
        <el-empty description="暂时还没有贴子"/>
      </div>
      <div v-for="post in posts" :key="post.id"
           style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 600px;height: 150px ">
        <el-button style="float: right; margin-top: 20px;margin-right: 20px" type="danger" @click="post.deleteDialog=true">
          删除
        </el-button>
        <el-dialog v-model="post.deleteDialog" title="删除帖子" width="30%" center>
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
        <h3 class="hover"
            style="padding: 0 20px; height:28px;overflow: hidden"
            @click="browsePost(post.id)">
          {{ post.title }}

        </h3>

        <p style="padding: 0 20px;height:40px;overflow: hidden;">
          {{ post.content }}
        </p>
        <div style="padding: 0 20px;">
          <el-icon :size="size" :color="color">
            <ChatRound/>
          </el-icon>
          {{ post.floor_num }}
        </div>
      </div>
    </ul>
  </div>
</template>

<script>
import {ChatRound} from "@element-plus/icons-vue";

export default {
  name: "MyPost",
  components: {ChatRound},
  data() {
    return {
      posts: [
        {
          id: 123,
          title: "这是一个标题",
          content: "这是内容",
          floor_num: 44,
        },
        {
          title: "标题点一下可以跳转",
          content: "点内容不能跳转",
          floor_num: 44,
        },
        {
          title: "合一楼的XXX真好吃",
          content: "真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃",
          floor_num: 0,
        },
        {
          title: "这是一个很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的标题",
          content: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈这是一个很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的标题这是一个很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的标题",
          floor_num: 222,
        },
        {
          title: "再弄几个试试滚动条",
          content: "随便写点东西",
          floor_num: 433234,
        },
        {
          title: "就这样吧",
          content: "ok",
          floor_num: 5,
        },
      ],

    }
  },
  methods: {
    deletePost(post) {
      post.deleteDialog = false
      let that = this
      that.$axios.post('/InfoPage/deletePostById', {
        post_id: post.id
      }, {
        headers: {
          'token': that.$cookies.get('user_token')
        }
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          console.log("delete success")
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    queryAllPost() {
      let that = this
      that.$axios.post('/InfoPage/getMyAllPost', {}, {
        headers: {
          'token': that.$cookies.get('user_token')
        }
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          console.log("get post success")
          this.posts = res.data.posts_info
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    browsePost()
    {
      this.$router.push({path: '/home'})
    }

  },
  mounted() {
    this.queryAllPost()

  }
}
</script>

<style scoped>
.infinite-list {
  height: 450px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
</style>