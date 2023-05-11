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
                  authStore.users.map((user) => ({
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
import { SelectedQuiz, RecievedQuiz, AssignedQuiz } from "../../types/Practice";
import { onMounted } from "vue";
import DataTableHeader from "../../types/DataTableHeader";
import { VDataTable } from "vuetify/lib/labs/components";

const selectedQuiz = ref<SelectedQuiz>();
const selectedUser = ref(null);
const practiceStore = usePracticeStore();
const authStore = useAuthStore();
const listUserQuiz = ref<AssignedQuiz[]>();
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
});

const handleCancelClick = () => {
  selectedQuiz.value = undefined;
  selectedUser.value = null;
};
const handleSaveClick = async () => {
  practiceStore.assignQuiz();
};
const handleAddClick = () => {
  if (selectedQuiz.value && selectedUser.value) {
    listUserQuiz.value.push({
      email: selectedUser.value,
      quiz: selectedQuiz.value,
    });
  }
};

const handleDeleteUserQuiz = () => {};
</script>

<style scoped></style>
