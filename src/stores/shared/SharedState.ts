import { ref } from 'vue';
export const sharedState = {
    snackbar: ref({ active: false, color: "", message: "" })
  };