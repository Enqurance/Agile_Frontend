<template>
  <div
      style="padding-left: 10%;padding-top:10%;background: rgb(246,246,246);width: 90%">
    <div style="width: 90%">
      <div style="margin-bottom: 3%;font-size: 20px;">
        我的帖子
        <!--      <el-button style="margin-left: 40%" size="large" type="primary">-->
        <!--        创建-->
        <!--      </el-button>-->
      </div>
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
      >
        <el-menu-item index="1" @click="Index='1'">所有帖子</el-menu-item>
        <div class="flex-grow"/>
        <el-menu-item index="2" @click="Index='2'">待整改帖子</el-menu-item>
      </el-menu>
      <div v-if="this.Index==='1'">
        <ul class="infinite-list" style="overflow: auto">
          <div v-if="posts.length === 0">
            <el-empty description="暂时还没有贴子"/>
          </div>
          <div v-for="post in posts" :key="post.id"
               style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 98%;height: 150px ">
            <el-button style="float: right; margin-top: 20px;margin-right: 20px" type="danger"
                       @click="post.deleteDialog=true">
              删除
            </el-button>

            <el-dialog v-model="post.deleteDialog" title="删除帖子" width="80%" center>
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
              <el-icon>
                <ChatRound/>
              </el-icon>
              {{ post.floor_num }}
            </div>
          </div>
        </ul>
      </div>

      <div v-if="this.Index==='2'">
        <ul class="infinite-list" style="overflow: auto">
          <div v-if="posts.length === 0">
            <el-empty description="暂时还没有贴子"/>
          </div>
          <div v-for="post in bad_posts" :key="post.id"
               style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 98%;height: 150px ">
            <el-button style="float: right; margin-top: 20px;margin-right: 20px" type="danger"
                       @click="post.deleteDialog=true">
              删除
            </el-button>
            <el-button style="float: right; margin-top: 20px;margin-right: 20px"
                       type="primary"
                       @click="editInfo(post)">
              整改
            </el-button>
            <el-dialog v-model="post.changeDialog" title="整改帖子" width="80%" center>
              <el-input
                  v-model="post.new_title"
                  type="textarea"
                  placeholder="Please input"
              />
              <div style="margin: 20px 0"/>
              <el-input
                  v-model="post.new_content"
                  type="textarea"
                  placeholder="Please input"
              />
              <template #footer>
              <span class="dialog-footer">
                <el-button @click="post.changeDialog = false">取消</el-button>
                <el-button type="primary" @click="changePost(post)">
                  确认
                </el-button>
              </span>
              </template>
            </el-dialog>

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
            >
              {{ post.title }}

            </h3>

            <p style="padding: 0 20px;height:40px;overflow: hidden;">
              {{ post.content }}
            </p>
            <div style="padding: 0 20px;">
              <el-button @click="post.reasonDialog=true" size="small"> 查看原因</el-button>
            </div>
            <el-dialog v-model="post.reasonDialog" title="整改原因" width="30%" center>
            <span style="text-align: center">
              {{ post.reason }}
            </span>
              <template #footer>
            <span class="dialog-footer">
              <el-button @click="post.reasonDialog = false">关闭</el-button>
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
import {ChatRound} from "@element-plus/icons-vue";

export default {
  name: "MyPost_Mobile",
  components: {ChatRound},
  data() {
    return {
      posts: [
      ],
      bad_posts: [
      ],
      activeIndex: '1',
      Index: '1',
    }
  },
  methods: {
    deletePost(post) {
      let that = this
      post.deleteDialog = false;
      console.log(post);
      that.$axios.delete('/forum/post/deletePost/' + post.id, {
        headers: {
          'token': that.$cookies.get('user_token')
        }
      }).then((res) => {
        if (res.data.code === 200) {
          console.log("删除的帖子id为：" + post.id)
          this.$message({
            type: 'info',
            message: '删除成功',
          });
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch((res) => console.log(res))
    },
    editInfo(post) {
      post.changeDialog = true;
      post.new_title = post.title;
      post.new_content = post.content;
    },
    queryAllPost() {
      let that = this
      that.$axios.get('/InfoPage/MyPost/getMyAllPost', {
        headers: {
          'token': that.$cookies.get('user_token')
        }

      }).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          console.log("get post success")
          this.posts = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    queryBadPost() {
      let that = this
      that.$axios.get('/InfoPage/MyPost/getMyBadPost', {
        headers: {
          'token': that.$cookies.get('user_token')
        }

      }).then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          console.log("get bad post success")
          this.bad_posts = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    browsePost(id) {
      // 记得改
      this.$router.push({path: '/Forum/' + id})
    },
    changePost(post) {
      post.changeDialog = false;
      let that = this
      that.$axios.post('/InfoPage/MyPost/changePostById', {
        post_id: post.id,
        new_title: post.new_title,
        new_content: post.new_content,
      }, {
        headers: {
          'token': that.$cookies.get('user_token')
        }
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          console.log("change success")
          this.$message({
            message: "已提交整改，请耐心等待",
            type: 'success'
          })
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
    this.queryAllPost()
    this.queryBadPost()
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