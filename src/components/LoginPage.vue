<template>
    <PCLoginPage v-if="this.$device==='pc'"/>
    <MobileLoginPage v-else />
</template>

<script>
import PCLoginPage from "@/components/pc/PCLoginView.vue";
import MobileLoginPage from "@/components/mobile/MobileLoginView.vue";

export default {
    name: "LoginPage",
    components: {MobileLoginPage, PCLoginPage}
}
</script>

<style scoped>

</style>