<script>
import { Position, CollectionTag } from '@element-plus/icons-vue'

export default {
    name: "MyPin",
    components: {
        Position, 
        CollectionTag
    },
    inject: ['reload'],
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
            console.log(this.pins);
        },
    }
}
</script>

<template>
    <div v-if="isReload">
    <div  v-if="count > 0">
    <el-scrollbar height="400px">
        <p v-for="i in count" :key="i" class="scrollbar-demo-item">
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>{{ pins[i-1].name }}</span>
                        <el-button @click="deleteConfirm = true; curI = i;" type="danger">Delete</el-button>
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
        <div v-else><el-empty description="该用户没有私有钉子"/></div>
    </div>

    <el-dialog
        v-model="deleteConfirm"
        title="确认"
        width="30%"
        align-center
    >
        <span>您确认删除该钉子吗？</span>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="deleteConfirm = false">取消</el-button>
            <el-button type="danger" plain @click="deletePin(this.pins[curI-1].id, curI-1); deleteConfirm = false">
            确认
            </el-button>
        </span>
        </template>
    </el-dialog>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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