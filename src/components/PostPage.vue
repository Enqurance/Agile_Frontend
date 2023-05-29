<template>
    <PCPostPage v-if="this.$device==='pc'"/>
    <MobilePostPage v-else/>
</template>

<script>
import PCPostPage from "@/components/pc/PCPostPage.vue";
import MobilePostPage from './mobile/MobilePostPage.vue';

export default {
    name: "PostPage",
    components: { PCPostPage, MobilePostPage }
}
</script>

<style scoped>

</style>