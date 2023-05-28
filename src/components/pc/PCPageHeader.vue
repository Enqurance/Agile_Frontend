<script>
import {ref, toRaw} from 'vue'
import {reactive} from 'vue'
import {useRouter} from 'vue-router';
import global from "@/global";

export default {
    setup() {
        let router = useRouter()
        let page = toRaw(router).currentRoute.value.fullPath;
        // console.log(page);
        let Index = ref('5');

        if (page === '/') {
            Index = '2';
        }
        else if (page === '/home') {
            Index = '2';
        }
        else if (page === '/InforPage') {
            Index = '5';
        }
        else if (page === '/Forum') {
            Index = '3';
        }
        else if (page === '/Administrator') {
            Index = '4';
        }

        const user = reactive({
            id: 0,
            name: "initial",
            email: 'initial' + "@buaa.edu.cn",
            type: 0,
            password: 'initial',
            icon: '',
            campus: "initial",
            grade: "initial",
            gender: 0,
            description: "tell you later .",
        });
        const imageUrl = ref('');

        return {
            Index, user, imageUrl
        };
    },
    mounted() {
        this.initInfor();
    },
    methods: {
        get_user_type_administrator() {
            return global.user_type_administrator
        },
        clickToMap() {
            this.Index = '2';
            this.$router.push({
                path: '/home',
                query: {},
            });
        },
        clickToInfor() {
            this.Index = '5';
            this.$router.push({
                path: '/InforPage',
                query: {},
            });
        },
        clickToForum() {
            this.Index = '3';
            this.$router.push({
                path: '/Forum',
                query: {},
            });
        },
        clickToAdministrator() {
            this.Index = '4';
            this.$router.push({
                path: '/Administrator',
                query: {},
            });
        },
        clickToLogin() {
            this.$router.push({
                path: '/login',
                query: {},
            });
        },

        getIcon() {
            let that = this;
            that.$axios.get('user/getIcon',
                {
                    headers: {
                        'token': that.$cookies.get('user_token')
                    },
                }).then((res) => {
                //console.log(res);
                this.user.icon = res.data.data;
                this.imageUrl = res.data.data;
                //console.log(this.user.icon);
            }).catch((res) => console.log(res))

            this.refreshIcon();
        },
        refreshIcon() {
            this.isReload = false;
            this.$nextTick(() => {
                this.isReload = true;
            })
        },

        initInfor() {
            let that = this;
            // console.log(that.$cookies.get('user_token'));
            that.$axios.get('user/getUserByToken', {
                headers: {
                    'token': that.$cookies.get('user_token')
                }
            }).then((res) => {
                // console.log(res);
                this.user.id = res.data.data.id;
                this.user.name = res.data.data.name;
                this.user.email = res.data.data.email;
                this.user.type = res.data.data.type;
                this.user.password = res.data.data.password;
                this.user.icon = res.data.data.icon;
                this.user.campus = res.data.data.campus;
                this.user.grade = res.data.data.grade;
                this.user.gender = res.data.data.gender;
                this.user.description = res.data.data.description;
                // console.log(this.user);
            }).catch((res) => console.log(res));
            this.getIcon();
        },

        logOut() {
            this.$cookies.remove('user_token');
            this.$router.push({
                path: '/',
                query: {},
            });
            location.reload()
        },
    },
}
</script>

<template>
<<<<<<< HEAD
        <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
=======
        <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                :ellipsis="false"
                background-color=#87CEEB
                text-color="white"
                active-color=#2E8B57
                active-text-color="white"
        >
>>>>>>> 1e859e8 ([chore](Global):美化样式)
            <el-menu-item v-on:click="clickToMap()" index="1">
                BUAAMapForum
            </el-menu-item>
            <el-menu-item v-on:click="clickToMap()" index="2">
                Map
            </el-menu-item>
            <el-menu-item v-on:click="clickToForum()" index="3">
                Forum
            </el-menu-item>
            <el-menu-item v-if="this.$cookies.get('user_type')===get_user_type_administrator()" v-on:click="clickToAdministrator()" index="4">
                Administrator
            </el-menu-item>
            <div class="flex-grow" />
            <el-menu-item v-if="this.$cookies.get('user_token') === null" v-on:click="clickToLogin()" index="5">
                <template #title>Login</template>
            </el-menu-item>
                <el-sub-menu v-else index="5" v-on:click="clickToInfor()">
                    <template #title>
                        <el-avatar 
                            :size="40" 
                            shape="circle" 
                            :src="this.imageUrl"
                            style="user-select: none;">
                        </el-avatar>
                        <span style="margin-left:10px">
                            {{ this.user.name }}
                        </span>
                    </template>
                    <el-menu-item index="2-1" v-on:click="logOut">
                        账号登出
                    </el-menu-item>
                </el-sub-menu>
        </el-menu>
</template>

<style scoped>
.flex-grow {
    flex-grow: 1;
}
</style>>
