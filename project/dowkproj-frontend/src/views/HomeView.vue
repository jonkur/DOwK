<script setup>
import HomeComp from '@/components/HomeComp.vue'
</script>

<template>
  <main class="home">
    <HomeComp />
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .home {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>