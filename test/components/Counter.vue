<!-- src/components/Counter.vue -->
<template>
  <div>
    <button @click="increment">+</button>
    <span>{{ count }}</span>
    <button @click="decrement">-</button>
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