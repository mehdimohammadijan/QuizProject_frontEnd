import { inject } from "vue";
import { defineStore } from "pinia";
import axios from "../../plugins/axios"
import { User } from "../../types/User";
import Cookies from 'js-cookie'
import { sharedState } from '../shared/SharedState';

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null as User | null,
    isLoading: false as boolean,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async signUp(user: User): Promise<void> {
      const { firstName, lastName, email, password } = user;
      this.isLoading = true;
      this.error = null;
      await axios.post("/auth/signup", { firstName, lastName, email, password }).then((response: any) => {
        console.log(response.data);
        this.isLoading = false;
        sharedState.snackbar.value.message="User is created successfully.";
        sharedState.snackbar.value.color="success";
        sharedState.snackbar.value.active = true;
      }).catch((error: any) => {
        this.isLoading = false;
        this.error = error;
        sharedState.snackbar.value.message="Something went wrong!";
        sharedState.snackbar.value.color="orange-darken-2";
        sharedState.snackbar.value.active = true;
      })
     
    },
    async signIn(email: string, password: string): Promise<void> {
     this.isLoading = true;
     this.error = null;
      await axios.post("/auth/signin", { email, password }).then((response: any) => {
        this.user = response.data.user;
        Cookies.set('token', response.data.accessToken, { expires: 1 });
        Cookies.set('user', JSON.stringify(this.user));
        this.isLoading = false;
        sharedState.snackbar.value.message=`You are successfully signed in ${this.user.firstName}.`;
        sharedState.snackbar.value.color="success";
        sharedState.snackbar.value.active = true;
      }).catch((error: any) => {
        this.isLoading = false;
        this.error = error;
        sharedState.snackbar.value.message="Check your Email and Password!";
        sharedState.snackbar.value.color="orange-darken-2";
        sharedState.snackbar.value.active = true;
      });
    
    },
    signOut(): void{
      Cookies.remove('token');
      Cookies.remove('user');
      this.user = null;
    },
  },
});
