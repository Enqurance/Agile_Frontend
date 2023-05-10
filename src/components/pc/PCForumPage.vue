<template>
    <div>
        <PageHeader style="position: fixed; top: 0; width: 100%; z-index: 3; background: black; opacity: 0.3" />
        <p style="top: 20%">这是论坛页面</p>

        <el-button @click="showNewPostDialog">显示固定组件</el-button>
        <new-post ref="child"></new-post>
    </div>

</template>


<script>
import PageHeader from "@/components/pc/PCPageHeader.vue";
import NewPost from "../sub_components/NewPost.vue";

export default {
    name: "PCMapHomepage",

    components: {
        PageHeader,
        NewPost,
    },

    methods: {
        showNewPostDialog() {
            this.$refs.child.dialogVisible = true
        }
    }
}  
</script>