import { inject } from "vue";
import { defineStore } from "pinia";
import axios from "../../plugins/axios";
import { Practice, RecievedQuiz } from "../../types/Practice";
export const usePracticeStore = defineStore("PracticeStore", {
  state: () => ({
    user: null as User | null,
    isLoading: false as boolean,
    error: null,
    data: [] as RecievedQuiz[]
  }),
  actions: {
    async getPractices(): Promise<void>{
      this.isLoading = true;
      try {
        const response = await axios.get<RecievedQuiz[]>("/practices");
        this.isLoading = false;
        this.error = null;
        this.data = response.data;
      } catch (error: any) {
        this.isLoading = false;
        this.error = error;
      }
    },
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
    async saveList(practices: Practice[]){
      this.isLoading = true;
      try {
        await axios.post("/practices/saveList", practices);
        this.isLoading = false;
        this.error = null;
      } catch (error: any) {
        this.isLoading = false;
        this.error = error;
      }
    },
  },
});
