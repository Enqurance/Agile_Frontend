<template>
<!--    <router-view/>-->
  <MyPost></MyPost>
</template>

<script>

import MyMessage from "@/components/MyMessage";
import MyPost from "@/components/MyPost";
import MyComment from "@/components/MyComment";
export default {
    name: 'App',
    components: {MyPost},
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
