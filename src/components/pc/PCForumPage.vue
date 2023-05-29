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

                        <div style="position: relative;">
                            <el-input v-model="search_context" placeholder="Search" @input="handleSearchInput"
                                      @keyup.enter="handleSearchInput" style="width: 250px;"></el-input>
                            <div v-show="showDropdown"
                                 :style="{position: 'relative', left: '0', width: '100%'}">
                                <div class="scrollable">
                                    <div v-for="item in searchResults" :key="item.post_id"
                                         @click="handleSelect(item.post_id)"
                                         style="width: 250px;margin-top: 10px;margin-bottom: 10px;">
                                        <span style="font-size: 18px;word-wrap:break-word;padding-left: 10px;">{{
                                                item.post_title
                                            }}</span>
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
                        <div v-for="post in posts" :key="post.id" style="padding-top: 20px;">
                            <!-- <router-link :to="`/Forum/${post.id}`" class="custom-link" @click="tokenCheck"> -->
                            <router-link :to="`/Forum/${post.id}`" class="custom-link">
                                <el-card style="min-height: auto;">
                                    <template #header>
                                        <div class="card-header">
                                            <span>{{ post.title }}</span>
                                            <div>
                                                <span style="padding-right: 20px">{{
                                                        getTimeSubstring(post.createTime)
                                                    }}</span>
                                                <el-tag class="tag" size="large">{{ _get_pin_type(post.tag) }}</el-tag>
                                            </div>
                                        </div>
                                    </template>
                                    <el-col :span="24">
                                        <el-row>
                                            <div>
                                                <!-- <p>{{ post.content }}</p> -->
                                                <div v-html="post.content"></div>
                                            </div>
                                        </el-row>
                                        <el-row>
                                            <el-descriptions :column="3">
                                                <el-descriptions-item min-width="100px" label="点赞数">{{
                                                        post.thumbsUp
                                                    }}
                                                </el-descriptions-item>
                                                <el-descriptions-item min-width="100px" label="访问量">{{
                                                        post.visit
                                                    }}
                                                </el-descriptions-item>
                                                <el-descriptions-item min-width="100px" label="楼层数">{{
                                                        post.floorNum
                                                    }}
                                                </el-descriptions-item>
                                            </el-descriptions>
                                        </el-row>
                                    </el-col>
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
import {ref, onMounted, getCurrentInstance, watch} from 'vue'
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
            showDropdown: false
        };
    },

    setup() {
        const currentPage = ref(1);
        const totalPosts = ref(0);

        const {proxy} = getCurrentInstance();
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
                if (res.data.code === 200) {
                    posts.value = res.data.data.retPosts;
                    totalPosts.value = res.data.data.length;
                    //console.log(res.data.data.retPosts)
                }
                else {
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
        handleDocumentClick(event) {
            const scrollableEl = this.$el.querySelector('.scrollable'); // 获取<div class="scrollable">的DOM元素
            if (!scrollableEl.contains(event.target)) {
                this.showDropdown = false;
            }
        },

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
                //console.log(res)
                if (res.data.code === 200) {
                    that.searchResults = res.data.data.slice(0, 5)

                    that.showDropdown = that.search_context !== "";
                }
                else {
                    that.showDropdown = false
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
            if (!this.$cookies.get('user_token')) {
                this.$message({
                    message: '请先登录!',
                    type: "warning"
                })
                this.$router.push({path: '/login'})
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
        document.addEventListener('click', this.handleDocumentClick);
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    },
}
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title h2 {
    margin: 0;
    color: #333;
}

.main {
    display: flex;
    justify-content: space-between;
    margin: 0 15%;
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
    width: 100%;
    margin-bottom: 20px;
    height: 100px;
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

.scrollable {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #ccc;
    position: absolute;
    z-index: 9999;
    background-color: #fff
}
</style>