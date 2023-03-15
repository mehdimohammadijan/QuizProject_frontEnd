<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './components/UI/Navbar.vue';

const drawer = ref(true)
</script>

<template>
<div>
  <VApp class="yellow-darken-2">
    <Navbar />
    <div >
      
    </div>
    <VMain>
     <router-view />
    </VMain>
 
  </VApp>
 
</div>
 
</template>

<style scoped>
  .topBackground {
    background-image: url('https://www.leadquizzes.com/wp-content/uploads/2019/02/New-blog-graphic.jpg');
    height: 500px;
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
    background-size: cover;


  }
</style>
