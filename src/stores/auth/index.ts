import { inject } from "vue";
import { defineStore } from "pinia";
import axios from "../../plugins/axios"
import { User } from "../../types/User";
import Cookies from 'js-cookie'
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
      await axios.post("/auth/signup", { firstName, lastName, email, password }).then((response: any) => {
        console.log(response.data);
        this.isLoading = false;
      }).catch((error: any) => {
        this.isLoading = false;
        this.error = error;
      })
     
    },
    async signIn(email: string, password: string): Promise<void> {
     this.isLoading = true;
      await axios.post("/auth/signin", { email, password }).then((response: any) => {
        console.log(response)
        this.user = response.data.user;
        Cookies.set('token', response.data.accessToken, { expires: 1 });
        Cookies.set('user', JSON.stringify(this.user));
        this.isLoading = false;
      }).catch((error: any) => {
        this.isLoading = false;
        this.error = error;
      });
    
    },
    signOut(): void{
      Cookies.remove('token');
      Cookies.remove('user');
      this.user = null;
    },
  },
});
