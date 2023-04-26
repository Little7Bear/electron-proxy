<template>
  <div class="wrapper">
    <NetProxy />
  </div>
</template>

<script lang="ts" setup>
import NetProxy from './components/NetProxy.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 60px auto;
  width: 700px;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
