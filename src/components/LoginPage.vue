<template>
    <PCLoginPage v-if="this.$device==='pc'"/>
    <MobileLoginPage v-else />
    <CopyrightICP/>
</template>

<script>
import PCLoginPage from "@/components/pc/PCLoginView.vue";
import MobileLoginPage from "@/components/mobile/MobileLoginView.vue";
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
    name: "LoginPage",
    components: {MobileLoginPage, PCLoginPage, CopyrightICP}
}
</script>

<style scoped>

</style>