<template>
    <el-cascader
        v-model="value"
        ref="cascader"
        :options="options"
        placeholder="请选择Tag"
        :show-all-levels="false">
    </el-cascader>
</template>

<script>
import global from "@/global";

export default {
    name: "PostBindPin",
    setup() {

    }


};
</script>

<style>

</style>