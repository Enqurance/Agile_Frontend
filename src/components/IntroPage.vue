<template>
    <PCIntroPage v-if="this.$device==='pc'"/>
    <MobileIntroPage v-else/>
</template>

<script>
import PCIntroPage from "@/components/pc/PCInforPage.vue";
import MobileIntroPage from "@/components/mobile/MobileIntroPage.vue";

export default {
    name: "InforPage",
    components: { PCIntroPage, MobileIntroPage }
}
</script>

<style scoped>

</style>