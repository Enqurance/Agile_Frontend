<template>
    <PCForumPage v-if="this.$device==='pc'"/>
    <MobileForumPage v-else/>
</template>

<script>
import PCForumPage from "@/components/pc/PCForumPage.vue";
import MobileForumPage from './mobile/MobileForumPage.vue';

export default {
    name: "ForumPage",
    components: { PCForumPage, MobileForumPage }
}
</script>

<style scoped>

</style>