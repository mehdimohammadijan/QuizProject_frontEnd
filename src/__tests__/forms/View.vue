<template>
    <component
      :is="props.element"
      :aria-label="props.ariaLabel"
      :disabled="props.isDisabled"
      ><slot></slot
    ></component>
</template>

<script setup lang="ts">
const props = defineProps<{
  element: string;
  ariaLabel?: string;
  isDisabled?: boolean;
}>();
</script>

<style scoped></style>
