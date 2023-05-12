<template>
<<<<<<< HEAD
    <router-view/>
=======
   <router-view/>
  <!-- <MyMessage></MyMessage> -->
>>>>>>> 203d784 ((fix)[App.vue]:Retrun to router)
</template>

<script>

<<<<<<< HEAD
import MyMessage from "@/components/MyMessage";
import MyPost from "@/components/MyPost";
import MyComment from "@/components/MyComment";
export default {
    name: 'App',
    components: {},
=======
export default {
    name: 'App',
>>>>>>> 203d784 ((fix)[App.vue]:Retrun to router)
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