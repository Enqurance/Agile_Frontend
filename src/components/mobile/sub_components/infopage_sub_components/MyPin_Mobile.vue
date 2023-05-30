<script>
import {ref} from 'vue'
import { Delete } from '@element-plus/icons-vue'
export default {
    name: "MyPin_Mobile",
    components: {  },
    setup(){
    },
    data(){
        return{
            pins:[
                {
                    id: 0,
                    name: "first",
                    Inglat: "",
                    position: "绿园",
                    brief: "这是简介",
                    type: 0,
                    openTime: 0,
                    phone: 0,
                    visibility: 0,
                    user_id: 0,
                    phone_id: 0,
                    forum_id: 0,
                },
            ],
            count: 0,
            isReload: true,
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            let that = this;
            that.$axios.get('InfoPage/MyPin/getMyAllPin', 
                { 
                    headers: { 
                        'token': that.$cookies.get('user_token')
                    },
                }).then((res) => {
                    if (res.data.code === 200) {
                        this.pins = res.data.data;
                        this.count = this.pins.length;
                    } else {
                    }
                })
        },
        refreshPins(index) {
            this.isReload = false;
            this.pins.splice(index);
            this.count = this.count - 1;
            this.$nextTick(() => {
                this.isReload = true;
            })
        },
        deletePin(pid, index){
            let that = this
            that.$axios.delete('/map/pin/deletePin/' + pid, 
                { 
                    headers: { 
                        'token': that.$cookies.get('user_token')
                    },
                }
            ).then((res) => {
                if (res.data.code === 200) {
                } else {
                    this.$message({
                    message: res.data.message,
                    type: 'error'
                    })}
            })
            this.refreshPins(index);
            console.log(this.pins);
        },
    }
}
</script>

<template>
    <div v-if="isReload">
    <div  v-if="count > 0">
    <el-scrollbar height="400px">
        <p v-for="i in count" :key="i">
            <el-card shadow="hover">
                <template #header>
                    <div class="card-header">
                        <van-row>
                            <van-col span="15"><span>{{ pins[i-1].name }}</span></van-col>
                            <van-col span="9">
                                <el-button @click="deleteConfirm = true; curI = i;" plain type="danger">删除钉子</el-button>
                            </van-col>
                        </van-row>
                    </div>
                </template>
                <el-row>
                    <el-col>
                        <el-icon style="position:relative;top: 2px;margin-right: 10px">
                            <Position/>
                        </el-icon>
                        位置：{{ pins[i-1].position }}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-icon style="position:relative;top: 2px;margin-right: 10px">
                            <CollectionTag/>
                        </el-icon>
                        简介：{{ pins[i-1].brief }}
                    </el-col>
                </el-row>
            </el-card>
        </p>    
    </el-scrollbar>
    </div>
    <div v-else><el-empty description="该用户没有私有钉子" /></div>
    </div>
</template>

<style scoped>
.infinite-list {
  height: 400px;
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 2px;
}

.pinCard{
    width: 100%;
    height: 100%;
}
.textItem{
    width: 100%;
    height: 100%;
}
</style>