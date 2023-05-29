<template>
    <router-view/>
    <MobileNavigator v-if="this.$device==='mobile'"/>  
    <CopyrightICP/>
</template>

<script>
import CopyrightICP from '@/components/CopyrightICP.vue';

export default {
    name: 'App',
    components: {CopyrightICP},
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