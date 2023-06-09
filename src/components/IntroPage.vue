<template>
    <PCIntroPage v-if="this.$device==='pc'"/>
</template>

<script>
import PCIntroPage from "@/components/pc/PCInforPage.vue";

export default {
    name: "InforPage",
    components: { PCIntroPage }
}
</script>

<style scoped>

</style>