<template>
    <div>
        <PageHeader style="position: fixed; top: 0; width: 100%; z-index: 3; background: black; opacity: 0.3" />
        <p>这是论坛页面</p>
    </div>

</template>


<script>
import PageHeader from "@/components/pc/PCPageHeader.vue";

export default {
    name: "PCMapHomepage",

    components: {
        PageHeader,
    },

}  
</script>