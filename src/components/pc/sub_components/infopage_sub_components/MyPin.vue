<script>
import {ref} from 'vue'
export default {
    name: "MyPin",
    components: {},
    setup(){
        const count = ref(5)
        return {count}
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
            ]
        }
    },
    methods: {
        init(){
            let that = this
            that.$axios.get('/InfoPage/MyPin/getMyAllPin', 
                { headers: { 'token': that.$cookies.get('user_token')}}
            ).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    this.pins= res.data.pins;
                    console.log("init success")
                } else {
                    this.$message({
                    message: res.data.message,
                    type: 'error'
                    })}
            })
        },
        deletePin(pid){
            let that = this
            that.$axios.post('/InfoPage/MyPin/deletePinById', 
                { pin_id: pid},
                { headers: { 'token': that.$cookies.get('user_token')}}
            ).then((res) => {
                // console.log(res)
                if (res.data.code === 200) {
                    console.log("init success")
                } else {
                    this.$message({
                    message: res.data.message,
                    type: 'error'
                    })}
            })
        },
    }
}
</script>

<template>
    <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
        <li v-for="i in count" :key="i" class="infinite-list-item">
            <el-card class="pinCard">
                <div  class="text item">
                    <span>名字: {{ pins[0].name }}</span>
                    <span>位置： {{ pins[0].position }}</span>
                    <span>简介：{{ pins[0].brief }}</span>
                </div>
            </el-card>
        </li>
    </ul>
</template>

<style scoped>
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>