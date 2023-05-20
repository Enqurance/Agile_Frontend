<template>
    <PCInfoPage v-if="this.$device==='pc'"/>
</template>

<script>
import PCInfoPage from "@/components/pc/PCInforPage.vue";
export default {
    name: "InforPage",
    components: {PCInfoPage}
}
</script>

<style scoped>

</style>