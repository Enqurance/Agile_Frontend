<template>
    <PCForumPage v-if="this.$device==='pc'"/>
    <MobileForumPage v-else/>
    <CopyrightICP/>
</template>

<script>
import PCForumPage from "@/components/pc/PCForumPage.vue";
import MobileForumPage from './mobile/MobileForumPage.vue';
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
    name: "ForumPage",
    components: { PCForumPage, MobileForumPage, CopyrightICP }
}
</script>

<style scoped>

</style>