<template>
    <PCRegisterPage v-if="this.$device==='pc'"/>
</template>

<script>
import PCRegisterPage from "@/components/pc/PCRegisterView.vue";

export default {
    name: "RegisterPage",
    components: {PCRegisterPage},
}
</script>

<style scoped>

</style>