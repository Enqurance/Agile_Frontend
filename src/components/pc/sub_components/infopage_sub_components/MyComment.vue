<template>
  <div
      style="padding: 5% 10% 11% 10%;background: rgb(246,246,246); word-wrap: break-word; word-break: normal">
    <div style="padding-left: 5%;font-size: 20px;width:45%;display: inline-block">
      <div style="margin-bottom: 5%;font-size: 20px">
        我的楼层
      </div>

      <ul class="infinite-list" style="overflow: auto;display: inline-block">
        <div v-if="floors.length === 0">
          <el-empty description="暂时还没有楼层"/>
        </div>
        <div v-for="floor in floors" :key="floor.id"
             style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 97%;height: 150px ">
          <el-button style="float: right; margin-top: 20px;margin-right: 20px" type="danger"
                     @click="floor.deleteDialog=true">
            删除
          </el-button>
          <el-dialog v-model="floor.deleteDialog" title="删除楼层" width="30%" center>
          <span style="text-align: center">
            你确定要删除这个楼层吗？
          </span>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="floor.deleteDialog = false">取消</el-button>
                <el-button type="primary" @click="deleteFloor(floor)">
                  确认
                </el-button>
              </span>
            </template>
          </el-dialog>
          <h3 class="hover"
              style="padding: 0 20px; height:28px;overflow: hidden"
              @click="browseFloor(floor.id)">
            {{ floor.title }}

          </h3>

          <p style="padding: 0 20px;height:40px;font-size:16px;overflow: hidden;">
            {{ floor.content }}
          </p>
          <div style="padding: 0 20px;font-size:16px;">
            楼层：{{ floor.floor }}
          </div>
        </div>
      </ul>
    </div>

    <div style="padding-left: 5%;font-size: 20px;width:45%;display: inline-block">
      <div style="margin-bottom: 5%;font-size: 20px">
        我的评论
      </div>

      <ul class="infinite-list" style="overflow: auto;display: inline-block">
        <div v-if="comments.length === 0">
          <el-empty description="暂时还没有评论"/>
        </div>
        <div v-for="comment in comments" :key="comment.id"
             style="border-radius: 20px; background: white; border: 2px solid rgb(246,246,246); width: 97%;height: 150px ">
          <el-button style="float: right; margin-top: 20px;margin-right: 20px" type="danger"
                     @click="comment.deleteDialog=true">
            删除
          </el-button>
          <el-dialog v-model="comment.deleteDialog" title="删除评论" width="30%" center>
        <span style="text-align: center">
          你确定要删除这个评论吗？
        </span>
            <template #footer>
            <span class="dialog-footer">
              <el-button @click="comment.deleteDialog = false">取消</el-button>
              <el-button type="primary" @click="deleteComment(comment)">
                确认
              </el-button>
            </span>
            </template>
          </el-dialog>
          <h3 class="hover"
              style="padding: 0 20px; height:28px;overflow: hidden"
              @click="browseComment(comment.id)">
            {{ comment.title }}

          </h3>

          <p style="padding: 0 20px;height:40px;font-size:16px;overflow: hidden;">
            {{ comment.content }}
          </p>
          <div style="font-size:16px;padding: 0 20px;">
            回复楼层：{{ comment.floor }}
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: "MyComment",
  components: {},
  data() {
    return {
      comments: [
        {
          id: 123,
          title: "这是一个标题",
          content: "这是内容",
          floor: 44,
        },
        {
          title: "标题点一下可以跳转",
          content: "点内容不能跳转",
          floor: 44,
        },
        {
          title: "合一楼的XXX真好吃",
          content: "真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃",
          floor: 0,
        },
        {
          title: "这是一个很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的标题",
          content: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈这是一个很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的标题这是一个很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的标题",
          floor: 222,
        },
        {
          title: "再弄几个试试滚动条",
          content: "随便写点东西",
          floor: 433234,
        },
        {
          title: "就这样吧",
          content: "ok",
          floor: 5,
        },
      ],
      floors: [{
        id: 123,
        title: "这是一个标题",
        content: "这是楼层",
        floor: 23,
      },
        {
          title: "跟旁边不一样",
          content: "不一样",
          floor: 1,
        },
        {
          title: "合一楼的XXX真好吃",
          content: "真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃真好吃",
          floor: 6,
        },
        {
          title: "这是一个很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的标题",
          content: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈这是一个很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的标题这是一个很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的很长的标题",
          floor: 88,
        },
        {
          title: "再弄几个试试滚动条",
          content: "随便写点东西",
          floor: 433234,
        },
        {
          title: "就这样吧",
          content: "ok",
          floor: 5,
        },],
    }
  },
  methods: {
    deleteComment(comment) {
      comment.deleteDialog = false
      let that = this
      that.$axios.post('/InfoPage/MyComment/deleteCommentById', {
        comment_id: comment.id
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
    deleteFloor(floor) {
      floor.deleteDialog = false
      let that = this
      that.$axios.post('/InfoPage/MyFloor/deleteFloorById', {
        comment_id: floor.id
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
    queryAllComment() {
      let that = this
      that.$axios.get('/InfoPage/MyComment/getMyAllComment', {
        headers: {
          'token': that.$cookies.get('user_token')
        }

      }).then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          console.log("get comment success")
          this.comments = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    queryAllFloor() {
      let that = this
      that.$axios.get('/InfoPage/MyFloor/getMyAllFloor', {
        headers: {
          'token': that.$cookies.get('user_token')
        }

      }).then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          console.log("get comment success")
          this.floors = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    browseComment(id) {
      // 记得改
      this.$router.push({path: '/Forum/' + id})
    },
    browseFloor(id) {
      // 记得改
      this.$router.push({path: '/Forum/' + id})
    },

  },
  mounted() {
    this.queryAllComment()
    this.queryAllFloor()
  },

}
</script>

<style scoped>
.infinite-list {
  height: 460px;
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