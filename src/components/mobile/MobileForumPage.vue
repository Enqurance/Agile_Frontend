<template>
	<el-container>
		<el-main>
			<el-col :span="24">
				<el-row :gutter="20">
					<el-col :span="4" :offset="2">
					<el-avatar :size="70" shape="circle" :src="this.imageUrl" style="user-select: none;">
					</el-avatar>
					</el-col>
					<el-col :span="16" :offset="2">
                        <el-col :span="12">
						<el-input v-model="search_context" placeholder="Search" maxlength="10" @input="handleSearchInput"
								@keyup.enter="handleSearchInput" style="width: 100px;"></el-input>
						<div v-show="showDropdown"
							:style="{position: 'relative', left: '0', width: '100%'}">
							<div class="scrollable">
								<div v-for="item in searchResults" :key="item.post_id"
									@click="handleSelect(item.post_id)"
									style="width: 100px;margin-top: 10px;margin-bottom: 10px;">
									<span style="font-size: 18px;word-wrap:break-word;padding-left: 10px;">{{
											item.post_title
										}}
                                    </span>
								</div>
							</div>
						</div>
                        </el-col>
                        <el-col :span="12">
					    <el-button @click="showNewPostDialog">新建帖子</el-button>
						<new-post-mobile ref="child"></new-post-mobile>
                        </el-col>
					</el-col>
				</el-row>
				<el-row>
					<el-card class="box-card">
						<template #header>
							<div class="card-header">
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
					</template>
						<div v-for="post in posts" :key="post.id" style="padding-top: 20px;">
							<!-- <router-link :to="`/Forum/${post.id}`" class="custom-link" @click="tokenCheck"> -->
							<router-link :to="`/Forum/${post.id}`" class="custom-link">
								<el-card style="min-height: auto;">
									<template #header>
										<div class="card-header">
											<el-col :span="14">
												<pre style="word-wrap: break-word;font-family: 'Open Sans', sans-serif;white-space: pre-wrap;width: 100%; ">
                                                <div>{{ post.title }}</div>
                                                </pre>
											</el-col>
											<el-col :span="10"> 
                                                <el-row style="margin-bottom: 10px">
												<span>{{
														getTimeSubstring(post.createTime)
													}}</span>
                                                </el-row>
                                                <el-row style="margin-bottom: 10px">   
                                                    <el-col :offset="4"> 
												        <el-tag class="tag" size="small">{{ _get_pin_type(post.tag) }}</el-tag>
                                                    </el-col>
                                                </el-row>
											</el-col>
										</div>
									</template>
									<el-col :span="24">
										<el-row>
											<pre style="word-wrap: break-word;font-family: 'Open Sans', sans-serif;white-space: pre-wrap;width: 100%; ">
                                            <div v-html="post.content"></div>
                                            </pre>
										</el-row>
										<el-row>
											<el-descriptions :column="3">
												<el-descriptions-item :min-width="80" align label="点赞数">{{
														post.thumbsUp
													}}
												</el-descriptions-item>
												<el-descriptions-item :min-width="80" label="访问量">{{
														post.visit
													}}
												</el-descriptions-item>
												<el-descriptions-item :min-width="80" label="楼层数">{{
														post.floorNum
													}}
												</el-descriptions-item>
											</el-descriptions>
										</el-row>
									</el-col>
								</el-card>
							</router-link>
						</div>
					</el-card>
				</el-row>
				<el-row>
					<div>
						<el-pagination v-if="totalPosts > 0" @current-change="handlePageChange" v-model="currentPage"
									:page-size="limit" :small="true" :pager-count="5" :total="totalPosts">
						</el-pagination>
					</div>
				</el-row>
				<el-row></el-row>
				<el-row>
					<CopyrightICP/>
				</el-row>
			</el-col>
		</el-main>
	</el-container>
</template>


<script>
import { ref, onMounted, getCurrentInstance, watch } from 'vue'
import NewPostMobile from "./sub_components/NewPostMobile.vue";
import CopyrightICP from "@/components/CopyrightICP.vue";
import global from '@/global'

export default {
	name: "MobileForumpage",

	components: {
		NewPostMobile,
		CopyrightICP,
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
                else if (res.data.code === 500) {
                    that.searchResults = [];
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
                this.$router.push({ path: '/login' })
            }
            this.$refs.child.dialogVisible = true
        },

        initForum() {
            // console.log("init")
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

    computed: {
        noResults() {
            return this.searchResults.length === 0;
        }
    },
}
</script>

<style scoped>
.box-card {
  width: 100%;
  height: 100%;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.title h2 {
	margin: 0;
	color: #333;
}

.center {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.bottom {
	width: 100%;
	height: 500px;
	overflow-y: scroll;
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