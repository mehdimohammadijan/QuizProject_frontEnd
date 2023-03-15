<template>
    <div>
      <v-card class="elevation-12 mx-auto mt-10" max-width="500">
        <v-toolbar dark color="grey-lighten-1">
          <v-toolbar-title>Sign up</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form class="ml--5" @submit.prevent="submitFormHandler" ref="signupForm">
            <v-text-field
              variant="underlined"
              prepend-inner-icon="mdi-account"
              label="First Name"
              type="text"
              placeholder="First Name"
              :rules="firstNameRules"
              v-model="firstName"
            />
            <v-text-field
              variant="underlined"
              prepend-inner-icon="mdi-account-outline"
              label="Last Name"
              type="text"
              placeholder="Last Name"
              :rules="lastNameRules"
              v-model="lastName"
            />
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
            <v-switch label="Remember me" color="indigo" />
            <v-card-actions class="justify-center">
              <v-btn color="indigo" variant="flat" type="submit" 
                ><span class="px-6">Sign Up</span></v-btn
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
  const email = ref(null);
  const password = ref(null);
  const signupForm = ref<VForm | null>(null);
  const loading = ref(false);
  const firstName = ref<string>('');
  const lastName = ref<string>('');
  const firstNameRules = ref([
  (value: string) => {
      if (value) return true;
  
      return "First Name is required.";
    }
  ]);
  const lastNameRules = ref([
  (value: string) => {
      if (value) return true;
  
      return "Last Name is required.";
    }
  ]);
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
     const isValid = await signupForm.value?.validate()
     if(isValid.valid){
      await authStore.signUp({firstName: firstName.value, lastName: lastName.value, email: email.value!, password: password.value!})
      if(!authStore.error){
        router.push("/signin");
      }
        
     }
    
  };
  </script>
  
  <style scoped></style>
  