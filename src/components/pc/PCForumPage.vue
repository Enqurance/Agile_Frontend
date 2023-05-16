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
            <el-input placeholder="Search"></el-input>
            <el-button @click="showNewPostDialog">新建帖子</el-button>
            <new-post ref="child"></new-post>
          </div>
          <div class="bottom">
            <div v-for="post in posts" :key="post.id" style="padding: 10px;">
              <router-link :to="`/Forum/${post.id}`"  class="custom-link">
                <el-card style="padding: 10px;">
                  <div class="card-header">{{ post.title }}</div>
                  <div class="card-content">{{ post.content }}</div>
                </el-card>
              </router-link>
            </div>
          </div>
        </div>
        <div class="right"></div>
      </div>
    </el-main>
  </el-container>
</template>


<script>
import { ref } from 'vue'
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
      posts: [
        {
          id: 1,
          title: 'Post 1',
          content: 'Post 1 body',
        },
        {
          id: 2,
          title: 'Post 2',
          content: 'Post 2 body',
        },
        {
          id: 3,
          title: 'Post 3',
          content: 'Post 3 body',
        },
        {
          id: 4,
          title: 'Post 4',
          content: 'Post 4 body',
        },
        {
          id: 5,
          title: 'Post 5',
          content: 'Post 4 body',
        },
        {
          id: 6,
          title: 'Post 6',
          content: 'Post 6 body',
        },
        {
          id: 7,
          title: 'Post 7',
          content: 'Post 7 body这是一个换行\n\rvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv-----------------------------------------------------------',
        },
      ],

    };
  },

  setup() {
    const imageUrl = ref('');
    return { imageUrl };
  },

  methods: {
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
</style>