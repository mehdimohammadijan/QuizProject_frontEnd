<template>
  <div>
    <v-card class="elevation-12 mx-auto mt-10" max-width="900">
      <v-toolbar dark color="grey-lighten-1">
        <v-toolbar-title>Assign Quiz</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-autocomplete
                class="px-2 mx-2 mt-1"
                density="compact"
                label="User"
                :items="
                  authStore.users.map((user: any) => ({
                    id: user.id,
                    title: user.email,
                  }))
                "
                item-title="title"
                item-value="id"
                v-model="selectedUser"
              ></v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete
                class="px-2 mx-2 mt-1"
                density="compact"
                label="Quiz"
                :items="practiceStore.data.map((practice: RecievedQuiz) => ({id: practice.id, title: practice.title}))"
                item-title="title"
                item-value="id"
                return-object
                v-model="selectedQuiz"
              ></v-autocomplete>
            </v-col>
            <v-col cols="1">
              <v-btn
                color="blue-darken-1"
                class="mr-2 mt-1"
                @click="handleAddClick"
                >Add</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                :headers="headers"
                :items="listUserQuiz"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title
                      >List of Assigned Quizes and Users</v-toolbar-title
                    >
                  </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon size="small" @click="handleDeleteUserQuiz(item.raw)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="blue-darken-1" class="mr-2" @click="handleCancelClick"
          >Cancel</v-btn
        >
        <v-btn color="blue-darken-1" @click="handleSaveClick">Save</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePracticeStore } from "../../stores/Practice";
import { useAuthStore } from "../../stores/auth";
import {
  SelectedQuiz,
  RecievedQuiz,
  AssignedQuiz,
  UpdateAssignedQuiz,
} from "../../types/Practice";
import { onMounted } from "vue";
import DataTableHeader from "../../types/DataTableHeader";
import { VDataTable } from "vuetify/lib/labs/components";

const selectedQuiz = ref<SelectedQuiz>();
const selectedUser = ref(null);
const practiceStore = usePracticeStore();
const authStore = useAuthStore();
const listUserQuiz = ref<AssignedQuiz[]>([]);
const updateListUserQuiz = ref<UpdateAssignedQuiz[]>([]);
const headers: DataTableHeader[] = [
  {
    title: "User email",
    align: "start",
    sortable: false,
    key: "email",
  },
  { title: "Quiz", key: "quiz" },
  { title: "Actions", key: "actions", sortable: false },
];

onMounted(async () => {
  await practiceStore.getPractices();
  await authStore.getUsers();
  initializeGrid();
});

const handleCancelClick = () => {
  selectedQuiz.value = undefined;
  selectedUser.value = null;
  updateListUserQuiz.value = [];
  initializeGrid();
};
const handleSaveClick = async () => {
  if (updateListUserQuiz.value.length > 0) {
    await practiceStore.assignQuiz(updateListUserQuiz.value);
  }
};
const handleAddClick = () => {
  if (selectedQuiz.value && selectedUser.value) {
    const index = listUserQuiz.value.findIndex(
      (item: AssignedQuiz) =>
        item.email === selectedUser.value &&
        item.quizId === selectedQuiz.value?.id
    );
    if (index === -1) {
      const userQuiz = {
        id: "",
        email: selectedUser.value,
        quiz: selectedQuiz.value.title,
        quizId: selectedQuiz.value.id,
      };
      listUserQuiz.value.push(userQuiz);
      updateListUserQuiz.value.push({ ...userQuiz, opt: "new" });
    }
  }
};

const initializeGrid = async () => {
  listUserQuiz.value = [];
  await practiceStore.getUserPractices();
  for (const item of practiceStore.assignedQuiz) {
    item.practices.forEach((practice) => {
      listUserQuiz.value.push({
        id: item.id,
        email: item.email,
        quiz: practice.practice.title,
        quizId: practice.practice.id,
      });
    });
  }
};

const handleDeleteUserQuiz = (userQuiz: AssignedQuiz) => {
  const index = listUserQuiz.value.findIndex(
    (item: AssignedQuiz) =>
      item.email === userQuiz.email && item.quizId === userQuiz.quizId
  );
  const updateIndex = updateListUserQuiz.value.findIndex(
    (item) => item.email === userQuiz.email && item.quizId === userQuiz.quizId && item.opt === 'new'
  );
  if(updateIndex > -1){
    updateListUserQuiz.value.splice(updateIndex, 1);
  }
  else {
    updateListUserQuiz.value.push({ ...userQuiz, opt: "delete" });
  }
  if (index > -1) {
    listUserQuiz.value.splice(index, 1);
  }
};
</script>

<style scoped></style>
