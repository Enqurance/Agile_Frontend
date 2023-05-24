<template>
  <el-container>
    <el-header>
      <PageHeader style="position: fixed; top: 0; width: 100%; z-index: 3; background: black; opacity: 0.3" />
    </el-header>
    <el-main>
      <div class="main">
        <div class="left"></div>
        <div class="center">
          <div class="top">
            <div class="avatar">
              <img :src="this.imageUrl" alt="avatar" class="avatar-img">
            </div>

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
            <div v-for="post in posts" :key="post.id" style="padding: 10px;">
              <router-link :to="`/Forum/${post.id}`" class="custom-link">
                <el-card style="padding: 10px;">
                  <div class="card-header">{{ post.title }}</div>
                  <div class="card-content">{{ post.content }}</div>
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
import { ref, onMounted, getCurrentInstance } from 'vue'
import PageHeader from "@/components/pc/PCPageHeader.vue";
import NewPost from "../sub_components/NewPost.vue";

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

    const loadPosts = (offset) => {
      proxy.$axios.post('/forum/post/getPosts', null, {
        params: {
          offset: parseInt(offset.value),
          limit: parseInt(limit)
        },
        headers: {
          'token': proxy.$cookies.get('user_token')
        }
      }).then((res) => {
        posts.value = res.data.data.retPosts;
        totalPosts.value = res.data.data.length;
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


    return {
      imageUrl, posts, currentPage, totalPosts, limit,
      handlePageChange
    };
  },

  methods: {
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
      this.$router.push(`/Forum/${id}`);
    },

    showNewPostDialog() {
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

      this.refreshIcon();
    },
    refreshIcon() {
      this.isReload = false;
      this.$nextTick(() => {
        this.isReload = true;
      })
    },
  },

  mounted() {
    this.initForum();
  },
}
</script>

<style>
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main {
  display: flex;
  justify-content: space-between;
  margin: 0, 15%;
}

.left,
.right {
  width: 15%;
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