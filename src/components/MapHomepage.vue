<template>
    <PCMapHomepage v-if="this.$device==='pc'"/>
    <MobileMapHomepage v-else />
</template>

<script>
import PCMapHomepage from "@/components/pc/PCMapHomepage.vue";
import MobileMapHomepage from "@/components/mobile/MobileMapHomepage.vue";

export default {
    name: "MapHomepage",
    components: {MobileMapHomepage, PCMapHomepage}
}
</script>

<style scoped>

</style>