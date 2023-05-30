<template>
    <router-view/>
    <div  v-if="this.$device==='mobile'">
        <MobileNavigator/>  
        <div style="height: 4rem;"></div>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: {
        
    },
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