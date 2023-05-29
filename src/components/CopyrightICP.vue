<template>
    <div class="icp">{{`© ${year} ${author} `}}<a href="http://beian.miit.gov.cn/" target="_blank">{{ record }}</a></div>
</template>

<script setup>
let year = new Date().getFullYear();        // 一般都是最新的一年
let author = 'Agile - 埃杰';					// 作者名
let record = '京ICP备2023010281号'			// 备案号
</script>

<style>
.icp {
    position: absolute;
    bottom: 0px;
    padding: 2px 0;
    width: 100%;
    text-align: center;
    color: gray;
}
.icp > a {
    color: gray;
    text-decoration: none;
}
.icp > a:hover {
    color: aqua;
    text-decoration: none;
}
</style>
