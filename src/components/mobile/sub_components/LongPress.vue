<template>
    <div class="long-press" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
        <slot></slot>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'LongPress',
    setup(props, { emit }) {
        const timeout = ref(null);

        const onTouchStart = () => {
            timeout.value = setTimeout(() => {
                emit('long-press');
            }, 1000); // 长按时间为1秒
        };

        const onTouchMove = () => {
            clearTimeout(timeout.value);
        };

        const onTouchEnd = () => {
            clearTimeout(timeout.value);
        };

        return {
            onTouchStart,
            onTouchMove,
            onTouchEnd,
        };
    },
};
</script>

<style scoped>
.long-press {
    user-select: none;
}
</style>
