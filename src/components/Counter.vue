<!-- src/components/Counter.vue -->
<template>
  <div>
    <el-button testid="123">
      123
    </el-button>

  </div>
</template>

<script>
export default {
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