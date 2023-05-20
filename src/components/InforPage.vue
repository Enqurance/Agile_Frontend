<template>
    <PCInfoPage v-if="this.$device==='pc'"/>
    <MyPost_Mobile v-if="this.$device!=='pc'"></MyPost_Mobile>
</template>

<script>
import PCInfoPage from "@/components/pc/PCInforPage.vue";
import MyPost_Mobile from "@/components/sub_components/infopage_sub_components/MyPost_Mobile";

export default {
    name: "InforPage",
    components: {MyPost_Mobile, PCInfoPage}
}
</script>

<style scoped>

</style>