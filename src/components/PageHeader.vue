<script>
export default {
    setup(){
        
    },
    methods: {
        clickToMap(){
            this.$router.push({
                path: '/',
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
    <div class="boby">
        <ul style="display:flex">
            <div class="left">
            <li  style="padding-left:%5; margin-right:%200">
                <a v-on:click="clickToMap()">Map</a>
            </li>
            <li  style="margin-left:20px; margin-right:30px">
                <a v-on:click="clickToChoose()">Forum</a>
            </li>
            </div>
            <li>
                <span style="font-weight:550 ;margin-left:100px; margin-right:100px"></span>
            </li>
            <div class="right">
            <li>
            </li>
            <li>
                <a @click="clickToInfor()" round>Infor</a>
            </li>
            </div>
        </ul>
    </div>
</template>

<style scoped>
.body{
    margin-top: 10%;
    font-display: 700;
    height: 20px;
    width: 20px;
}
.ul{
    margin-top: 10%;
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