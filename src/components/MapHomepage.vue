<template>
    <PCMapHomepage v-if="this.$device==='pc'"/>
</template>

<script>
import PCMapHomepage from "@/components/pc/PCMapHomepage.vue";

export default {
    name: "MapHomepage",
    components: {PCMapHomepage}
}
</script>

<style scoped>

</style>