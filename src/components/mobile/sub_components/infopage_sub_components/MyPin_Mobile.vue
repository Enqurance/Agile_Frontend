<script>
import {ref} from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { Position, CollectionTag } from '@element-plus/icons-vue'
import CopyrightICP from "@/components/CopyrightICP.vue"

export default {
    name: "MyPin_Mobile",
    components: { 
        Position, 
        CollectionTag,
        CopyrightICP
    },
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
            deleteConfirm: false,
            applyConfirm: false,
            curI: 0,
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
        },
        applyPin(pid){
            let that = this
            that.$axios.get('examine/apply_for_public/' + pid, 
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
                <van-row>
                    <van-col span="8"><span>{{ pins[i-1].name }}</span></van-col>
                    <van-col span="8">
                        <el-button @click="applyConfirm = true; curI = i;" plain type="success" size="small">申请公开</el-button>    
                    </van-col>
                    <van-col span="8">
                        <el-button @click="deleteConfirm = true; curI = i;" plain type="danger" size="small">删除钉子</el-button>
                    </van-col>
                </van-row>
                <van-divider style="margin-top:5%;margin-bottom:5%;"/>
                <van-row>
                    <van-col style="padding-bottom: 3%;">
                        <el-icon style="position:relative;top: 2px;margin-right: 10px">
                            <Position/>
                        </el-icon>
                        位置：{{ pins[i-1].position }}
                    </van-col>
                </van-row>
                <van-row>
                    <van-col>
                        <el-icon style="position:relative;top: 2px;margin-right: 10px">
                            <CollectionTag/>
                        </el-icon>
                        简介：{{ pins[i-1].brief }}
                    </van-col>
                </van-row>
            </el-card>
        </p>    
    </el-scrollbar>
    <el-row></el-row>
    <el-row>
        <CopyrightICP/>
    </el-row>
    <el-row></el-row>
    </div>
    <div v-else><el-empty description="该用户没有私有钉子" /></div>
    </div>

    <van-dialog v-model:show="deleteConfirm" title="删除确认" show-cancel-button
        @confirm="deletePin(this.pins[curI-1].id, curI-1); deleteConfirm = false" 
        @cancel="deleteConfirm = false">
        <p style="text-align: center;">您确认删除该钉子吗？</p>
    </van-dialog>

    <van-dialog v-model:show="applyConfirm" title="删除确认" show-cancel-button
        @confirm="applyPin(this.pins[curI-1].id, curI-1); applyConfirm = false" 
        @cancel="applyConfirm = false">
        <p style="text-align: center;">您确认将该钉子申请为公共钉子吗？</p>
    </van-dialog>
</template>

<style scoped>
</style>