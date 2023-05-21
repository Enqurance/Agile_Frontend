<template>
    <PCInfoPage v-if="this.$device==='pc'"/>
    <MobileInfoPage v-else/>
</template>

<script>
import PCInfoPage from "@/components/pc/PCInforPage.vue";
import MobileInfoPage from "@/components/mobile/MobileInfoPage.vue";
export default {
    name: "InforPage",
    components: {PCInfoPage, MobileInfoPage}
}
</script>

<style scoped>

</style>