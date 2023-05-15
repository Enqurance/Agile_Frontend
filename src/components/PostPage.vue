<template>
    <PCPostPage v-if="this.$device==='pc'"/>
</template>

<script>
import PCPostPage from "@/components/pc/PCPostPage.vue";

export default {
    name: "PostPage",
    components: {PCPostPage}
}
</script>

<style scoped>

</style>