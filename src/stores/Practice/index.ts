import { defineStore } from "pinia";
import axios from "../../plugins/axios";
import {
  UpdateAssignedQuiz,
  AssignedUserQuiz,
  Practice,
  RecievedQuiz,
  CurrentPractice
} from "../../types/Practice";
import { sharedState } from "../shared/SharedState";
export const usePracticeStore = defineStore("PracticeStore", {
  state: () => ({
    isLoading: false as boolean,
    error: null,
    data: [] as RecievedQuiz[],
    assignedPractices: [] as AssignedUserQuiz[],
    singleUserPractices: [] as RecievedQuiz[],
    currentPractice: {} as CurrentPractice
  }),
  actions: {
    async getPractices(): Promise<void> {
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
    async getPracticesWithQuestions(): Promise<void> {
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

    async getSingleUserPractices(): Promise<void> {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "user-practice/getsingleuserpractices"
        );
        this.isLoading = false;
        this.error = null;
        this.singleUserPractices =
          response.data.length > 0
            ? response.data[0].practices.map((p) => p.practice)
            : [];
      } catch (error: any) {
        this.isLoading = false;
        this.error = error;
      }
    },

    async getSingleUserPractice(qId: string): Promise<void> {
      this.isLoading = true;
      try {
        const response = await axios.get(`/user-practice/${qId}`);
        this.isLoading = false;
        this.error = null;
        this.currentPractice = response.data;
        console.log(response.data)
      } catch (error: any) {
        this.isLoading = false;
        this.error = error;
      }
    },

    async createPractice(practice: Practice): Promise<void> {
      const { title, description } = practice;
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post("/practices", { title, description });
        this.isLoading = false;
        sharedState.snackbar.value.message = "Quiz created successfully.";
        sharedState.snackbar.value.color = "success";
        sharedState.snackbar.value.active = true;
      } catch (error: any) {
        this.isLoading = false;
        this.error = error;
      }
    },
    async saveList(practices: Practice[]) {
      this.isLoading = true;
      this.error = null;
      await axios
        .post("/practices/saveList", practices)
        .then((response) => {
          this.isLoading = false;
          sharedState.snackbar.value.message =
            "Quiz list is successfully updated.";
          sharedState.snackbar.value.color = "success";
          sharedState.snackbar.value.active = true;
        })
        .catch((error: any) => {
          this.isLoading = false;
          this.error = error;
          sharedState.snackbar.value.message = "OOPS something went wrong!";
          sharedState.snackbar.value.color = "orange-darken-2";
          sharedState.snackbar.value.active = true;
        });
    },
    async assignQuiz(assignedQuiz: UpdateAssignedQuiz[]) {
      this.isLoading = true;
      this.error = null;
      await axios
        .post("/user-practice/assignPractice", assignedQuiz)
        .then(() => {
          this.isLoading = false;
          sharedState.snackbar.value.message = "Quiz is successfully assigned.";
          sharedState.snackbar.value.color = "success";
          sharedState.snackbar.value.active = true;
        })
        .catch((error: any) => {
          this.isLoading = false;
          this.error = error;
          sharedState.snackbar.value.message = "OOPS something went wrong!";
          sharedState.snackbar.value.color = "orange-darken-2";
          sharedState.snackbar.value.active = true;
        });
    },
    async getUserPractices() {
      this.isLoading = true;
      this.error = null;
      await axios
        .get("/user-practice")
        .then((response) => {
          this.isLoading = false;
          this.assignedPractices = response.data;
        })
        .catch((error: any) => {
          this.isLoading = false;
          this.error = error;
        });
    },
  },
});
