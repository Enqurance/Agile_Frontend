<script>
export default {
    setup(){
        
    },
    methods: {
        clickToMap(){
            this.$router.push({
                path: '/Map',
                query: {
                },
            });
        },
        clickToInfor(){
            this.$router.push({
                path: '/InforPage',
                query: {
                },
            });
        },
        clickToForum(){
            this.$router.push({
                path: '/',
                query: {
                },
            });
        },
    },
}
</script>

<template>
    <div id="boby">
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="col">
                    <span style="font-weight:550 ;margin-left:100px; margin-right:100px">BUAA MapForm</span>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="col">
                    <el-button v-on:click="clickToMap()" class="tag">Map</el-button>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="col">
                    <el-button v-on:click="clickToForum()" class="tag">Forum</el-button>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="col">
                    <el-button v-on:click="clickToInfor()" class="tag">Infor</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
#body{
    margin-top: 10%;
    /*font-display: 700;*/
    height: 20px;
    width: 20px;
}
.ul{
    margin-top: 10%;
}
.col{
    border: solid;
    border-width: thin;
    margin: 0;
    padding-left: 0 !important;
    padding-right: 0 !important;
}
.tag{
    height: 100%;
    width: 100%;
}
.left{
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 2%;
    margin-right: 20%;
}
.right{
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 20%;
    margin-right: 2%;
}
.li{
    border: 0;
    font-family: inherit;
    font-size: 100%;
    font-weight: 400;
    font-style: normal;
    line-height: 1.55;
    display: list-item;
    text-align: -webkit-match-parent;
}
span{
    font-size: 120%;
}
a{
    font-size: 120%;
    font-weight: 550;
}
</style>