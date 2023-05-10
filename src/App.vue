<template>
<!--    <router-view/>-->
  <MyMessage></MyMessage>
</template>

<script>

import MyMessage from "@/components/MyMessage";
export default {
    name: 'App',
    components: {MyMessage},
    provide() {
        return {
            reload: this.reload
        }
    },

    data() {
        return {
            isRouterAlive: true
        }
    },

    methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            });
        }
    },
}
</script>

<style>

</style>
