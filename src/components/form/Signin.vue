<template>
  <div>
    <v-card class="elevation-12 mx-auto mt-10" max-width="500">
      <v-toolbar dark color="grey-lighten-1">
        <v-toolbar-title>Sign in</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form class="ml--5" @submit.prevent="submitFormHandler" ref="signinForm">
          <v-text-field
            variant="underlined"
            prepend-inner-icon="mdi-email"
            label="Email"
            type="email"
            placeholder="Email"
            :rules="emailRules"
            v-model="email"
          />
          <v-text-field
            variant="underlined"
            prepend-inner-icon="mdi-key"
            label="Password"
            placeholder="Password"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            v-model="password"
          />
          <p class="text-body-1 ml-10">
            Don't have an account,
            <router-link to="/signup">Sign Up</router-link>.
          </p>
          <v-switch label="Remember me" color="indigo" />
          <v-card-actions class="justify-center">
            <v-btn color="indigo" variant="flat" type="submit" :loading="authStore.isLoading" 
              ><span class="px-6">Login</span></v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VForm } from 'vuetify/lib/components/VForm/VForm';
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
const router = useRouter();
const showPassword = ref(false);
const email = ref('');
const password = ref('');
const signinForm = ref<VForm | null>(null);
const emailRules = ref([
  (value: string) => {
    if (value) return true;

    return "E-mail is required.";
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) return true;

    return "E-mail must be valid.";
  },
]);
const passwordRules = ref([
  (value: string) => {
    if (value) return true;

    return "Password is required.";
  },
  (value: string) => {
    if (value?.length >= 8) return true;

    return "Password must be at least 8 characters.";
  },
]);
const authStore = useAuthStore();
const submitFormHandler = async () => {
   const isValid = await signinForm.value?.validate()
   if(isValid.valid){
      await authStore.signIn(email.value , password.value );
      if(!authStore.error){
        router.push("/account");
      }
   }
  
};

</script>

<style scoped></style>
