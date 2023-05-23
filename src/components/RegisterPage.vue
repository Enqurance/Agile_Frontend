<template>
    <PCRegisterPage v-if="this.$device==='pc'"/>
    <MobileRegisterPage v-else />
</template>

<script>
import PCRegisterPage from "@/components/pc/PCRegisterView.vue";
import MobileRegisterPage from "@/components/mobile/MobileRegisterView.vue";

export default {
    name: "RegisterPage",
    components: {MobileRegisterPage, PCRegisterPage},
}
</script>

<style scoped>

</style>