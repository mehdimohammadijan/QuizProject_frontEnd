<template>
  <v-container style="border-color: black" v-if="practiceStore.data">
    <v-row>
      <v-col>
        <p class="h4">Quiz Name : {{ practiceStore.data.title }}</p>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="1">
        <v-btn
          icon="mdi-arrow-left"
          @click="prev"
          v-if="hasPrevQuestion"
        ></v-btn>
      </v-col>
      <v-col>
        <QuestionCard
          :question="currentQuestion"
          v-if="currentQuestion"
          @update-question="handleUpdateQuestion"
        />
      </v-col>
      <v-col cols="1">
        <v-btn
          icon="mdi-arrow-right"
          @click="next"
          v-if="hasMoreQuestion"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
  <!-- <v-card flat rounded="0">
    <v-window v-model="onboarding">
      <v-window-item
        v-for="(q, index) in practiceStore.data.questions"
        :key="q.id"
        :value="index + 1"
      >
        <v-card height="500" class="pl-4 pt-4">
          <span class=""> {{ index + 1 }} : {{ q.questionText }} </span>
          <v-card-text v-if="q.questionType === 'Column'">
            <v-row>
              <v-col>
                 <draggable
                  class="list-group"
                  :list="list1"
                  group="people"
                  @change="log"
                  itemKey="name"
                >
                  <template #item="{ element, index }">
                    <div class="list-group-item">
                      {{ element.name }} {{ index }}
                    </div>
                  </template>
                </draggable> 
              </v-col>
            </v-row>
            <v-row>
              <v-col> 
               <draggable
                  class="list-group"
                  :list="list2"
                  group="people"
                  itemKey="id"
                >
                  <template #item="{ element, index }">
                    <div class="list-group-item">
                      {{ element.questionText }}
                    </div>
                  </template>
                </draggable>
              </v-col>
            </v-row>
          </v-card-text>
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
          <v-btn :variant="isSelected ? 'outlined' : 'text'" @click="toggle">{{
            n
          }}</v-btn>
        </v-item>
      </v-item-group>
      <v-btn variant="plain" icon="mdi-chevron-right" @click="next"></v-btn>
    </v-card-actions>
  </v-card> -->
</template>

<script setup lang="ts">
import { onBeforeMount, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { usePracticeStore } from "../../stores/Practice";
import QuestionCard from "./QuestionCard.vue";
import { CurrentPractice } from "../../types/Practice";
import { Question } from "../../types/Question";
const practiceStore = usePracticeStore();
const route = useRoute();
const quizId = route.params.quizId as string;
const length = ref<number>(0);
const currentQuestion = ref<Question>();
const currentIndex = ref(0);
const currentPractice = ref<CurrentPractice>();
onBeforeMount(async () => {
  await getSingleUserPractice();
  currentPractice.value = practiceStore.currentPractice;
  length.value = currentPractice.value?.questions.length;
  currentQuestion.value = currentPractice.value.questions[currentIndex.value];
});

const hasMoreQuestion = computed(() => {
  return length.value - 1 > currentIndex.value;
});
const hasPrevQuestion = computed(() => {
  return currentIndex.value > 0;
});

const next = () => {
  if (hasMoreQuestion.value) {
    currentIndex.value++;
    currentQuestion.value = currentPractice.value?.questions[currentIndex.value];
  }
};
const prev = () => {
  if (hasPrevQuestion.value) {
    currentIndex.value--;
    currentQuestion.value = currentPractice.value.questions[currentIndex.value];
  }
};

const getSingleUserPractice = async () => {
  await practiceStore.getSingleUserPractice(quizId);
};
const handleUpdateQuestion = (payload) => {
  const index = currentPractice.value.questions.indexOf(q => q.id === payload.id);
  currentPractice.value.questions[index]=payload;
}
</script>

<style scoped></style>
