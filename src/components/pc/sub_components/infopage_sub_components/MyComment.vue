<template>
    <div style="margin: 0 auto;padding: 0 3%; width: 80%">
        <div class="sub_div" v-if="subMenu === 1" >
            <div style="overflow: auto">
                <div class="empty_div" v-if="floors.length === 0">
                    <el-empty description="暂时还没有楼层"/>
                </div>
                <div v-else class="post_div" v-for="floor in floors" :key="floor.id">
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

                    <el-popover placement="top-start" :hide-after="0" trigger="hover"
                                content="点击跳转至帖子">
                        <template #reference>
                            <h3 class="link_hover" style="padding: 0 20px; width: 300px; height:28px;overflow: hidden"
                                @click="browseFloor(floor.id)">
                                {{ floor.title }}
                            </h3>
                        </template>
                    </el-popover>

                    <p style="padding: 0 20px;height:40px;font-size:16px;overflow: hidden;">
                        {{ floor.content }}
                    </p>
                    <div style="padding: 0 20px;font-size:16px;">
                        楼层：{{ floor.floor }}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="subMenu === 2" class="sub_div">
            <div style="overflow: auto">
                <div class="empty_div" v-if="comments.length === 0">
                    <el-empty description="暂时还没有评论"/>
                </div>
                <div v-else class="post_div" v-for="comment in comments" :key="comment.id">
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

                    <el-popover placement="top-start" :hide-after="0" trigger="hover"
                                content="点击跳转至帖子">
                        <template #reference>
                            <h3 class="link_hover" style="padding: 0 20px; width: 300px; height:28px;overflow: hidden"
                                @click="browseComment(comment.id)">
                                {{ comment.title }}
                            </h3>
                        </template>
                    </el-popover>

                    <p style="padding: 0 20px;height:40px;font-size:16px;overflow: hidden;">
                        {{ comment.content }}
                    </p>
                    <div style="font-size:16px;padding: 0 20px;">
                        回复楼层：{{ comment.floor }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "MyComment",
    props: {
        subMenu: Number
    },
    data() {
        return {
            comments: [],
            floors: [],
        }
    },
    methods: {
        deleteComment(comment) {// 执行删除评论的逻辑
            let that = this
            comment.deleteDialog = false;
            that.$axios.delete('/forum/comment/deleteComment/' + comment.id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    // console.log("删除的comment的id为：" + comment.id)
                    this.$message({
                        type: 'info',
                        message: '删除成功',
                    });
                    this.queryAllComment()
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))
            // console.log('删除评论ID为' + comment.id);
        },
        deleteFloor(floor) {
            let that = this
            floor.deleteDialog = false;
            that.$axios.delete('/forum/floor/deleteFloor/' + floor.id, {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    // console.log("删除的floor的id为：" + floor.id)
                    this.$message({
                        type: 'info',
                        message: '删除成功',
                    });
                    this.queryAllFloor()
                }
                else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => console.log(res))
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
                    // console.log("get comment success")
                    this.comments = res.data.data
                }
                else {
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
                    // console.log("get comment success")
                    this.floors = res.data.data
                }
                else {
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

.infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 8px;
    color: var(--el-color-primary);
}

.link_hover {
    cursor: pointer;
}

.sub_div {

}

.empty_div {
    margin-top: 10%;
}

.post_div {
    margin: 20px 0;
    border-radius: 20px;
    background: white;
    border: 2px solid rgb(246,246,246);
    width: 98%;height: 150px
}
</style>