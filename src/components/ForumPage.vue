<template>
    <PCForumPage v-if="this.$device==='pc'"/>
</template>

<script>
import PCForumPage from "@/components/pc/PCForumPage.vue";

export default {
    name: "ForumPage",
    components: {PCForumPage}
}
</script>

<style scoped>

</style>