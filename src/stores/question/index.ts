import { defineStore } from "pinia";
import axios from "../../plugins/axios";
import { Practice, RecievedQuiz } from "../../types/Practice";
import { SendQuestion } from "../../types/Question";
import { User } from "../../types/User"
import { sharedState } from '../shared/SharedState';
import { CreateQuestion } from '../../types/Question'
export const useQuestionStore = defineStore("QuestionStore", {
  state: () => ({
    isLoading: false as boolean,
    error: null,
    data: [],
    questionDetail: null
  }),
  actions: {

    async getQuestions() {
      this.isLoading = true;
      try {
        const response = await axios.get("/questions");
        this.isLoading = false;
        this.error = null;
        this.data = response.data;
        console.log(response.data);
      } catch (error: any) {
        this.isLoading = false;
        this.error = error;
      }
    },
    async getQuestionDetails(id: string, type: string) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/questions/${id}/${type}`);
        this.isLoading = false;
        this.error = null;
        this.questionDetail = response.data;
        console.log(response.data);
      } catch (error: any) {
        this.isLoading = false;
        this.error = error;
      }
    },

    async createQuestion(sendQuestion : CreateQuestion): Promise<void> {
      console.log(sendQuestion)
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post("/questions", sendQuestion);
        this.isLoading = false;
        sharedState.snackbar.value.message="Question created successfully.";
        sharedState.snackbar.value.color="success";
        sharedState.snackbar.value.active = true;
      } catch (error: any) {
        this.isLoading = false;
        this.error = error;
        sharedState.snackbar.value.message="OOPS something went wrong!";
        sharedState.snackbar.value.color="orange-darken-2";
        sharedState.snackbar.value.active = true;
      }
    },

  },
});
