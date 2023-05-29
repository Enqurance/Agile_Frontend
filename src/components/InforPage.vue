<template>
    <PCInfoPage v-if="this.$device==='pc'"/>
    <MobileInfoPage v-else/>
    <CopyrightICP/>
</template>

<script>
import PCInfoPage from "@/components/pc/PCInforPage.vue";
import MobileInfoPage from "@/components/mobile/MobileInfoPage.vue";
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
    name: "InforPage",
    components: {PCInfoPage, MobileInfoPage, CopyrightICP}
}
</script>

<style scoped>

</style>