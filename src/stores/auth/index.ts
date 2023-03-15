import { inject } from "vue";
import { defineStore } from "pinia";
import axios from "../../plugins/axios"
import { User } from "../../types/User";
export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: null as User | null,
    isLoading: false as boolean,
    error: null
  }),
  actions: {
    async signUp(user: User): Promise<void> {
      const { firstName, lastName, email, password } = user;
      this.isLoading = true;
      await axios.post("/auth/signup", { firstName, lastName, email, password }).then((response: any) => {
        console.log(response.data);
        this.isLoading = false;
      }).catch((error: any) => {
        this.isLoading = false;
        this.error = error;
      })
     
    },
    async signIn(email: string!, password: string!): Promise<void> {
     this.isLoading = true;
      await axios.post("/auth/signin", { email, password }).then((response: any) => {
        this.user = { firstName: response.data.firstName}
        this.isLoading = false;
      }).catch((error: any) => {
        this.isLoading = false;
        this.error = error;
      });
    
    },
  },
});
