<template>
  <v-card theme="dark" flat rounded="0">
    <v-window v-model="onboarding">
      <v-window-item v-for="(q, index) in practiceStore.data.questions" :key="q.id" :value="index">
        <v-card height="200" class="d-flex justify-center align-center">
          <span class="text-h2"> {{ q.questionText }} </span>
        </v-card>
      </v-window-item>
    </v-window>

    <v-card-actions class="justify-space-between">
      <v-btn variant="plain" icon="mdi-chevron-left" @click="prev"></v-btn>
      <v-item-group v-model="onboarding" class="text-center" mandatory>
        <v-item
          v-for="n in length"
          :key="`btn-${n}`"
          v-slot="{ isSelected, toggle }"
          :value="n"
        >
          <v-btn
            :variant="isSelected ? 'outlined' : 'text'"
            icon="mdi-record"
            @click="toggle"
          ></v-btn>
        </v-item>
      </v-item-group>
      <v-btn variant="plain" icon="mdi-chevron-right" @click="next"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { usePracticeStore } from "../../stores/Practice";
const practiceStore = usePracticeStore();
const route = useRoute();
const quizId = route.params.quizId as string;
const length = ref<number>(0);
const onboarding = ref(0);
onMounted(async () => {
  await getSingleUserPractice();
  length.value= practiceStore.data.questions.length;
});

const getSingleUserPractice = async () => {
  await practiceStore.getSingleUserPractice(quizId);
};
const next = () => {
  onboarding.value =
    onboarding.value + 1 > length.value ? 1 : onboarding.value + 1;

};
const prev= () => {
        onboarding.value = onboarding.value - 1 <= 0
          ? length.value
          : onboarding.value - 1
      };

</script>

<style scoped></style>
