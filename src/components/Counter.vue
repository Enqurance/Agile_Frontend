<!-- src/components/Counter.vue -->
<template>
  <div>
    <feedback-button></feedback-button>
    <el-button></el-button>
  </div>
</template>

<script>
import FeedbackButton from "@/components/FeedbackButton";
export default {
  components: {FeedbackButton},
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
};
</script>