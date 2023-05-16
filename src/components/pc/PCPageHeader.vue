<script>
import {ref, toRaw} from 'vue'
import { reactive } from 'vue'
import {useRouter} from 'vue-router';

export default {
    setup() {
        let router = useRouter()
        let page = toRaw(router).currentRoute.value.fullPath;
        // console.log(page);
        let Index = ref('4');

        let isMap = ref(false);
        let isForum = ref(false);
        let isInfor = ref(true);
        if (page === '/') {
            isMap = true;
            isForum = false;
            isInfor = false;
            Index = '2';
        }
        if (page === '/home') {
            isMap = true;
            isForum = false;
            isInfor = false;
            Index = '2';
        }
        if (page === '/InforPage') {
            isMap = false;
            isForum = false;
            isInfor = true;
            Index = '4';
        }
        if (page === '/Forum') {
            isMap = false;
            isForum = true;
            isInfor = false;
            Index = '3';
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

        return {Index, isMap, isForum, isInfor,
                user, imageUrl};
    },
    mounted() {
        this.initInfor();
    },
    methods: {
        clickToMap() {
            this.Index = '2';
            this.$router.push({
                path: '/home',
                query: {},
            });
        },
        clickToInfor() {
            this.Index = '4';
            this.$router.push({
                path: '/InforPage',
                query: {},
            });
        },
        clickToForum() {
            this.Index = '3';
            this.$router.push({
              path: '/Forum',
              query: {
              },
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
    },
}
</script>

<template>
    <div class="boby">
    <el-menu
        :default-active="Index"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
    >
        <el-menu-item v-on:click="clickToMap()" index="1" >
            <template #title>BUAAMapForum</template>
        </el-menu-item>
        <el-menu-item v-on:click="clickToMap()" index="2">
            <template #title>Map</template>
        </el-menu-item>
        <el-menu-item v-on:click="clickToForum()" index="3">
            <template #title>Forum</template>
        </el-menu-item>
        <div class="flex-grow" />
        <div v-if="this.$cookies.get('user_token') === null" class="last">
            <el-menu-item v-on:click="clickToLogin()" index="4">
            <template #title>Login</template>
            </el-menu-item>
        </div>
        <div v-else>
            <el-sub-menu index="4" v-on:click="clickToInfor()" class="last">
                <template #title>
                    <img class="ava" :src="this.imageUrl" alt="头像">
                    <!--<div class="imgBox"><el-avatar class="ava" :src="this.imageUrl"/></div>-->
                    <p>{{ this.user.name }}</p>
                </template>
                <el-menu-item index="2-1">登出</el-menu-item>
            </el-sub-menu>
        </div>
        
    </el-menu>
    <!--
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="col" style="padding-top: 1%; text-align: center">
                    <span style="font-weight:550 ;margin-left:10%; color:blanchedalmond">BUAAMapForum</span>
                </div>
            </el-col>
            <el-col :span="6">
                <el-button v-on:click="clickToMap()" class="tag" text :bg="this.isMap"><span style="font-weight:500;">Map</span>
                </el-button>
            </el-col>
            <el-col :span="6">
                <div class="col">
                    <el-button v-on:click.stop.prevent="clickToForum()" disabled class="tag" text :bg="this.isForum"><span>Forum</span>
                    </el-button>
                </div>
            </el-col>
            <el-col :span="6">
                <div v-if="this.$cookies.get('user_token') === null" class="col">
                    <el-button v-on:click="clickToLogin()" class="tag" text :bg="this.isInfor"><span>Login</span>
                    </el-button>
                </div>
                <div v-else class="col">
                    <el-button v-on:click="clickToInfor()" class="tag" text :bg="this.isInfor"><span>Infor</span>
                    </el-button>
                </div>
            </el-col>
        </el-row>
        -->
    </div>
</template>

<style scoped>
.class {
    margin-top: 5%;
}

.el-col el-col-6 is-guttered {
    padding-left: 0 !important;
    padding-right: 0 !important;
}

.col {
    margin: 0;
    padding-left: 0 !important;
    padding-right: 0 !important;
}

.last{
    margin-left: 65%;
}
.imgBox{
    width: 30%;
    height: 30%;
    padding-right:15%;
}
.ava{
    width:30%;

    max-width: 30%;
    object-fit: cover;
}

.tag {
    height: 100%;
    width: 100%;
}
.flex-grow {
  flex-grow: 10;
}

span {
    font-size: 120%;
}

a {
    font-size: 120%;
    font-weight: 550;
}
</style>