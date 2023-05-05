<template>
    <PCLoginPage v-if="this.$device==='pc'"/>
</template>

<script>
import PCLoginPage from "@/components/pc/PCLoginView.vue";

export default {
    name: "LoginPage",
    components: {PCLoginPage}
}
</script>

<style scoped>

</style>