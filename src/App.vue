<script setup lang="ts">
import Navbar from "./components/UI/Navbar.vue";
import { sharedState } from "./stores/shared/SharedState";
</script>
<template>
  <div>
    <VApp class="yellow-darken-2">
      <Navbar />
      <VMain>
        <router-view />
      </VMain>
      <v-snackbar
        v-model="sharedState.snackbar.value.active"
        :timeout="4000"
        :color="sharedState.snackbar.value.color"
      >
        {{ sharedState.snackbar.value.message }}
        <template v-slot:actions>
          <v-btn
            color="white"
            variant="text"
            @click="sharedState.snackbar.value.active = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </VApp>
  </div>
</template>
<style scoped>
.topBackground {
  background-image: url("https://www.leadquizzes.com/wp-content/uploads/2019/02/New-blog-graphic.jpg");
  height: 500px;
  width: 100%;
  display: block;
  position: absolute;
  top: 0;
  background-size: cover;
}
</style>
