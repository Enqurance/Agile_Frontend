<template>
    <div>
        <Vcode :show="isShow" @success="success" @fail='fail'></Vcode>
    </div>
</template>

<script>
import Vcode from "vue3-puzzle-vcode";

export default {
    emits: ['verified'],
    props: ['isShow'],
    components: {
        Vcode,
    },
    methods: {
        success() {
            // this.isShow = false;
            this.$emit('verified');
        },
        fail() {}
    }
}
</script>
