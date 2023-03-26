<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :sort-by="[{ key: 'title', order: 'asc' }]"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>List of Practices</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" v-bind="props">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.title"
                        label="Title"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.description"
                        label="Description"
                      ></v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.fat"
                        label="Fat (g)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.carbs"
                        label="Carbs (g)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.protein"
                        label="Protein (g)"
                      ></v-text-field>
                    </v-col> -->
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <v-col class="text-right" v-if="showCancelSave">
      <v-btn color="blue-darken-1 mr-2" @click="cancelSave">Cancel</v-btn>
      <v-btn color="blue-darken-1" @click="saveList">Save</v-btn>
    </v-col>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { VDataTable } from "vuetify/lib/labs/components";
import { usePracticeStore } from "../../stores/Practice";
import DataTableHeader from "../../types/DataTableHeader";
import { FullDetailPractice, RecievedQuiz } from "../../types/Practice";
const dialog = ref(false);
const dialogDelete = ref(false);

const headers : DataTableHeader[] = [
  {
    title: "Practice Title",
    align: "start",
    sortable: false,
    key: "title",
  },
  { title: "Description", key: "description" },
  { title: "Actions", key: "actions", sortable: false },
];
const finalPractices = ref<FullDetailPractice[]>([]);
const desserts = ref<FullDetailPractice[]>([]);
const editedIndex = ref(-1);
const editedItem = ref<FullDetailPractice>({
  opt: "",
  id: "",
  title: "",
  description: "",
});
const defaultItem = ref<FullDetailPractice>({
  opt: "",
  id: "",
  title: "",
  description: "",
});
const formTitle = computed(() => {
  return editedIndex.value === -1 ? "New Item" : "Edit Item";
});
watch(
  [() => dialog.value, () => dialogDelete.value],
  ([newDialog, newDialogDelete], [oldDialog, oldDialogDelete]) => {
    // newDialog || close();
    // newDialogDelete || closeDelete();
  }
);
const usePracStore = usePracticeStore();
onMounted(() => {
  fillTable();
});
const fillTable = async () => {
  await usePracStore.getPractices();
  initialize();
}
const showCancelSave = ref(false);
const cancelSave = () => {
  showCancelSave.value = false;
  initialize();
  finalPractices.value = [];
};
const saveList = async () => {
  if (finalPractices.value.length > 0) {
    const res = await usePracStore.saveList(finalPractices.value);
    console.log(res)
    if (!usePracStore.error) {
      showCancelSave.value = false;
      finalPractices.value = [];
    }
  }
};

const initialize = () => {
  desserts.value = usePracStore.data.map((practice: RecievedQuiz) => {
    return {
      opt: "",
      id: practice.id,
      title: practice.title,
      description: practice.description,
    };
  });
};
const editItem = (item: any) => {
  editedIndex.value = desserts.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
};
const deleteItem = (item: any) => {
  editedIndex.value = desserts.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
};
const deleteItemConfirm = () => {
  finalPractices.value.push({
    opt: "delete",
    id: desserts.value[editedIndex.value].id,
    title: desserts.value[editedIndex.value].title,
    description: desserts.value[editedIndex.value].description,
  });
  desserts.value.splice(editedIndex.value, 1);
  showCancelSave.value = true;
  closeDelete();
};
const close = () => {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
};
const closeDelete = () => {
  dialogDelete.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
};

const save = () => {
  if (editedIndex.value > -1) {
    Object.assign(desserts.value[editedIndex.value], editedItem.value);
    finalPractices.value.push({
      opt: "edit",
      id: editedItem.value.id,
      title: editedItem.value.title,
      description: editedItem.value.description,
    });
  } else {
    desserts.value.push(editedItem.value);
    finalPractices.value.push({
      opt: "new",
      id: editedItem.value.id,
      title: editedItem.value.title,
      description: editedItem.value.description,
    });
  }
  showCancelSave.value = true;
  close();
};
</script>

<style scoped></style>
