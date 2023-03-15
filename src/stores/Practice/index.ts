import { inject } from "vue";
import { defineStore } from "pinia";
import axios from "../../plugins/axios";
import Practice from "../../types/Practice";
export const usePracticeStore = defineStore("PracticeStore", {
  state: () => ({
    user: null as User | null,
    isLoading: false as boolean,
    error: null,
  }),
  actions: {
    async createPractice(practice: Practice): Promise<void> {
      const { title, description } = practice;
      this.isLoading = true;
      try {
        const response = await axios.post("/practices", { title, description });
        this.isLoading = false;
        this.error = null;
      } catch (error: any) {
        this.isLoading = false;
        this.error = error;
      }
    },
  },
});
