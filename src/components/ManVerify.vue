<!--<template>-->
<!--    <div>-->
<!--        <Vcode :show="isShow" @success="success" @close="close" @fail='fail'></Vcode>-->
<!--        <el-button type="primary" @click="submit">进行人机身份验证</el-button>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--import Vcode from "vue3-puzzle-vcode";-->

<!--export default {-->
<!--    emits: ['verified'],-->
<!--    components: {-->
<!--        Vcode,-->
<!--    },-->
<!--    data() {-->
<!--        return {-->
<!--            isShow: false-->
<!--        }-->
<!--    },-->
<!--    methods: {-->
<!--        submit() {-->
<!--            this.isShow = true;-->
<!--        },-->
<!--        success() {-->
<!--            this.isShow = false;-->
<!--            this.$emit('verified', this.value);-->
<!--        },-->
<!--        close() {-->
<!--            this.isShow = false;-->
<!--        },-->
<!--        fail() {}-->
<!--    }-->
<!--}-->
<!--</script>-->
