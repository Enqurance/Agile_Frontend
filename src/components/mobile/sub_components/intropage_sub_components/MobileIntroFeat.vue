<script>
import PCIntro from "@/components/pc/sub_components/PCIntro.vue";

export default {
    name: "MobileIntroFeat",
    components: {
         PCIntro,
    },
    setup(){
        const onClickLeft = () => history.back();
        return {
        onClickLeft,
        }
    },
}
</script>

<template>
    <div>
        <van-nav-bar
            title="功能介绍"
            left-text=""
            left-arrow
            @click-left="onClickLeft"
        />
        <PCIntro/>
    </div>
</template>