<template>
  <el-container>
    <el-header style="padding-left: 0;padding-right: 0">
        <PageHeader/>
    </el-header>
    <el-main>
      <div class="main">
        <div class="left"></div>
        <div class="center">
          <div class="top">
            <el-avatar :size="70" shape="circle" :src="this.imageUrl" style="user-select: none;">
            </el-avatar>

            <div class="search-wrapper">
              <el-input v-model="search_context" placeholder="Search" @input="handleSearchInput"></el-input>
              <div v-show="showDropdown" class="dropdown">
                <div class="scrollable">
                  <div v-for="item in searchResults" :key="item.post_id" @click="handleSelect(item.post_id)">
                    {{ item.post_title }}
                  </div>
                </div>
              </div>
            </div>

            <el-button @click="showNewPostDialog">新建帖子</el-button>
            <new-post ref="child"></new-post>
          </div>
          <div class="bottom">
            <div>
              <el-radio-group v-model="tag">
                <el-radio :label="0">全部</el-radio>
                <el-radio :label="1">餐饮</el-radio>
                <el-radio :label="2">园地</el-radio>
                <el-radio :label="3">教学</el-radio>
                <el-radio :label="4">体育</el-radio>
                <el-radio :label="5">办公</el-radio>
                <el-radio :label="6">购物</el-radio>
                <el-radio :label="7">生活服务</el-radio>
              </el-radio-group>
            </div>

            <div v-for="post in posts" :key="post.id" style="padding-top: 5px;">
              <!-- <router-link :to="`/Forum/${post.id}`" class="custom-link" @click="tokenCheck"> -->
              <router-link :to="`/Forum/${post.id}`" class="custom-link">
                <el-card style="min-height: auto;">
                  <div class="card_header">
                    <div class="title">
                      <h2 style="padding-bottom: 15px;">{{ post.title }}</h2>
                      <div style="display:flex;align-items: center;">
                        <el-tag class="tag">{{ _get_pin_type(post.tag) }}</el-tag>
                        <p style="padding-left: 10px;">{{ getTimeSubstring(post.createTime) }}</p>
                      </div>
                    </div>
                    <div style="width: 100px;">
                      <el-descriptions title="   " :column="1" style="width: 100px;">
                        <el-descriptions-item label="点赞数">{{ post.thumbsUp }}</el-descriptions-item>
                        <el-descriptions-item label="访问量">{{ post.visit }}</el-descriptions-item>
                        <el-descriptions-item label="楼层数">{{ post.floorNum }}</el-descriptions-item>
                      </el-descriptions>
                    </div>
                  </div>
                  <div>
                    <p>{{ post.content }}</p>
                  </div>
                </el-card>
              </router-link>
            </div>
            <el-pagination v-if="totalPosts > 0" @current-change="handlePageChange" v-model="currentPage"
              :page-size="limit" :total="totalPosts">
            </el-pagination>
          </div>
        </div>
        <div class="right"></div>
      </div>
    </el-main>
  </el-container>
</template>


<script>
import { ref, onMounted, getCurrentInstance, watch } from 'vue'
import PageHeader from "@/components/pc/PCPageHeader.vue";
import NewPost from "../sub_components/NewPost.vue";
import global from '@/global'

export default {
  name: "PCForumpage",

  components: {
    PageHeader,
    NewPost,
  },

  data() {
    return {
      search_context: '',
      searchResults: [],
      showDropdown: true
    };
  },

  setup() {
    const currentPage = ref(1);
    const totalPosts = ref(0);

    const { proxy } = getCurrentInstance();
    const imageUrl = ref('');
    const posts = ref([]); // 存储帖子列表
    const offset = ref(0); // 跳过的帖子数量
    const limit = 5; // 每页显示的帖子数量

    const tag = ref(0);

    const loadPosts = (offset) => {
      let api = '/forum/post/getPosts';
      let params = {
        offset: parseInt(offset.value),
        limit: parseInt(limit)
      };

      if (tag.value !== 0) {
        api = '/forum/post/getPostsByTag';
        params = {
          type: parseInt(tag.value),
          offset: parseInt(offset.value),
          limit: parseInt(limit)
        }
      }

      proxy.$axios.post(api, null, {
        params: params,
        headers: {
          'token': proxy.$cookies.get('user_token')
        }
      }).then((res) => {
        //console.log(res)
        if (res.data.code == 200) {
          posts.value = res.data.data.retPosts;
          totalPosts.value = res.data.data.length;
          //console.log(res.data.data.retPosts)
        } else {
          posts.value = [];
          totalPosts.value = 0;
        }
      }).catch((error) => {
        console.log(error);
      });
    };

    onMounted(() => {
      loadPosts(offset);
    });

    const handlePageChange = (currentPage) => {
      offset.value = (currentPage - 1) * limit;
      loadPosts(offset);
    };

    watch(tag, (newVal, oldVal) => {
      console.log(tag.value)
      loadPosts(offset);
    });

    return {
      imageUrl, posts, currentPage, totalPosts, limit, tag,
      handlePageChange
    };
  },

  methods: {


    _get_pin_type(pin_type_id) {
      return global.get_pin_type(pin_type_id)
    },

    handleSearchInput() {
      let that = this

      that.$axios.post('/forum/post/searchPosts', null, {
        params: {
          searchContext: that.search_context,
        },
        headers: {
          'token': that.$cookies.get('user_token')
        }
      }).then((res) => {
        if (res.data.code === 200) {
          that.searchResults = res.data.data
          //console.log(res.data.data)
        }
        else {
          that.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch((res) => console.log(res))

    },
    handleSelect(id) {
      // if (!this.$cookies.get('user_token')) {
      //   this.$message({
      //     message: '请先登录!',
      //     type: "warning"
      //   })
      //   this.$router.push({ path: '/login' })
      // } else {
      //   this.$router.push(`/Forum/${id}`);
      // }
      this.$router.push(`/Forum/${id}`);
    },

    showNewPostDialog() {
      if (!this.$cookies.get('user_token')) {
        this.$message({
          message: '请先登录!',
          type: "warning"
        })
        this.$router.push({ path: '/login' })
      }
      this.$refs.child.dialogVisible = true
    },

    initForum() {
      console.log("init")
      this.getIcon()
    },

    getIcon() {
      let that = this;
      that.$axios.get('user/getIcon',
        {
          headers: {
            'token': that.$cookies.get('user_token')
          },
        }).then((res) => {
          this.imageUrl = res.data.data;
        }).catch((res) => console.log(res))
    },

    getTimeSubstring(timeString) {
      if (timeString) {
        return timeString.substring(5, 16);
      }
    }
  },

  mounted() {
    this.initForum();
  },
}
</script>

<style scoped>
.card_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title {
  align-items: flex-start;
  justify-content: space-between;
  padding-top: 10px
}

.title h2 {
  margin: 0;
  color: #333;
}

.main {
  display: flex;
  justify-content: space-between;
  margin: 0, 15%;
}

.left,
.right {
  width: 20%;
}

.center {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  height: 100px;
  align-items: center;
}

.bottom {
  width: 100%;
  height: 500px;
  overflow-y: scroll;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.custom-link {
  text-decoration: none;
}

.search-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown {
  position: relative;
  width: 100%;
}

.scrollable {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
}

.dropdown>div {
  padding: 8px;
  cursor: pointer;
}

.dropdown>div:hover {
  background-color: #f5f5f5;
}
</style>