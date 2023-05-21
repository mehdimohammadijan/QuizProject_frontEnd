import { defineStore } from "pinia";
import axios from "../../plugins/axios";
import { UpdateAssignedQuiz, AssignedUserQuiz, Practice, RecievedQuiz } from "../../types/Practice";
import { User } from "../../types/User";
import { sharedState } from "../shared/SharedState";
export const usePracticeStore = defineStore("PracticeStore", {
  state: () => ({
    user: null as User | null,
    isLoading: false as boolean,
    error: null,
    data: [] as RecievedQuiz[],
    assignedQuiz: [] as AssignedUserQuiz[],
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
      console.log(assignedQuiz)
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
    async getUserPractices(){
      this.isLoading = true;
      this.error = null;
        await axios.get("/user-practice").then((response) => {
          this.isLoading = false;
          this.assignedQuiz = response.data;
        }).catch((error: any) => {
          this.isLoading = false;
        this.error = error;

        });
    }
  },
});
