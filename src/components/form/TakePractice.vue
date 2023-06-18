<template>
    <v-card class="elevation-12 mx-auto mt-10" max-width="900">
        <v-toolbar dark color="grey-lighten-1">
          <v-toolbar-title>Assigned Quizzes</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-if="practiceStore.singleUserPractices.length > 0">
                <v-data-table
                  :headers="headers"
                  :items="filteredQuizzes"
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-toolbar-title
                        >List of Assigned Quizzes</v-toolbar-title
                      >
                    </v-toolbar>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn small color="success" @click="startQuiz(item.raw.id)">Start</v-btn>
                  </template>
                </v-data-table>
              </v-col>
              <v-col v-else>
                <p class="font-weight-medium">
                  No Quiz assigned to this user.
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { usePracticeStore } from "../../stores/Practice";
import { VDataTable } from "vuetify/lib/labs/components";
import { RecievedQuiz } from '../../types/Practice';
import { RouteLocationNormalized, useRouter } from 'vue-router';
onMounted(async () => {
  await getUserAssinedPractices();
});
const practiceStore = usePracticeStore();
const getUserAssinedPractices = async () => {
    await practiceStore.getSingleUserPractices();
}


interface Quiz {
  id: number;
  name: string;
}

const headers = [
  { title: 'Quiz Title', value: 'title', key: 'title' },
  { title: "Actions", key: "actions", sortable: false },
];

const filteredQuizzes = computed(() => {
    return practiceStore.singleUserPractices.map((p: RecievedQuiz) => ({id: p.id, title: p.title}))
});

const router = useRouter();

const startQuiz = (quizId: string) => {
  const route: RouteLocationNormalized = { path: `/attemptpractice/${quizId}` };
  router.push(route);
};
</script>

<style scoped>

</style>