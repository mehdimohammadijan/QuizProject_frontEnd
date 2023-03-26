<template>
  <div>
    <v-card class="elevation-12 mx-auto mt-10" max-width="500">
      <v-toolbar dark color="grey-lighten-1">
        <v-toolbar-title>Create Practice:</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form
          class="ml--5"
          @submit.prevent="submitFormHandler"
          ref="createPracticeForm"
        >
          <v-text-field
            variant="underlined"
            label="Title"
            type="text"
            placeholder="Title"
            :rules="titleRules"
            v-model="title"
          />

          <v-textarea
            v-model="description"
            auto-grow
            variant="underlined"
            color="deep-purple"
            label="Description"
            :rules="descRules"
            rows="1"
          ></v-textarea>

          <v-card-actions class="justify-center">
            <v-btn
              color="indigo"
              variant="flat"
              type="submit"
              :loading="practiceStore.isLoading"
              ><span class="px-6">Create</span></v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">{{ snackbar.text }}</v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VForm } from "vuetify/lib/components/VForm/index";
import { usePracticeStore } from "../../stores/Practice";
const title = ref("");
const description = ref("");
const createPracticeForm = ref<VForm | null>(null);
const titleRules = ref([
  (value: string) => {
    if (value) return true;

    return "Title is required.";
  },
]);
const descRules = ref([
  (value: string) => {
    if (value) return true;

    return "Description is required.";
  },
]);
const snackbar = ref({
  show: false,
  text: '',
  color: ''
})

const practiceStore = usePracticeStore();
const submitFormHandler = async () => {
  const isValid = await createPracticeForm.value?.validate();
  if (isValid !== undefined) {
  if (isValid.valid) {
    const practice = {title: title.value, description: description.value};
    await practiceStore.createPractice(practice);
    console.log(practiceStore.error)
    if(!practiceStore.error){
      snackbar.value.text = 'Successfully created!'
      snackbar.value.color = 'success'
      snackbar.value.show = true
      }
      else{
      snackbar.value.text = practiceStore.error
      snackbar.value.color = 'error'
      snackbar.value.show = true
      }
  }
}
};
</script>

<style scoped></style>
