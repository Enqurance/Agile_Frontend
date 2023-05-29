<template>
    <PCRegisterPage v-if="this.$device==='pc'"/>
    <MobileRegisterPage v-else />
    <CopyrightICP/>
</template>

<script>
import PCRegisterPage from "@/components/pc/PCRegisterView.vue";
import MobileRegisterPage from "@/components/mobile/MobileRegisterView.vue";
import CopyrightICP from "@/components/CopyrightICP.vue";

export default {
    name: "RegisterPage",
    components: {MobileRegisterPage, PCRegisterPage, CopyrightICP},
}
</script>

<style scoped>

</style>