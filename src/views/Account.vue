<template>
v-text-field
<v-text-field label="Label" variant="underlined"
@input="handleInput"
></v-text-field>

</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const handleInput = () => {
  console.log("hi")
}


</script>
