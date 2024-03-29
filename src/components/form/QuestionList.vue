<template>
  <v-card class="ma-10">
    <v-toolbar flat>
      <v-toolbar-title>Question List</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn variant="tonal" @click="addQuestion">Add Question</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="questions"
      v-model:expanded="expandedRows"
      item-value="name"
      show-expand
      class="elevation-1"
      :search="searchQuestion"
    >
      <template v-slot:top>
        <v-text-field
          class="mx-5"
          variant="underlined"
          v-model="searchQuestion"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" @click="deleteQuestion(item.raw.id)">
          mdi-delete
        </v-icon>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <div style="padding: 15px">
              <v-card class="elevation-12 mx-auto mt-10" max-width="900">
                <v-card-text>
                  <v-form class="ml--5">
                    <v-row no-gutters>
                      <v-col cols="9">
                        <v-text-field
                          variant="underlined"
                          prepend-inner-icon="mdi-help"
                          label="Question"
                          type="text"
                          placeholder="Question"
                          v-model="item.value.questionText"
                          @input="handleCLick(item.raw)"
                        />
                      </v-col>
                      <v-col>
                        <v-autocomplete
                          class="px-2 mx-2 mt-1"
                          density="compact"
                          label="Type"
                          :items="['Column', 'Front', 'Row']"
                          v-model="item.value.questionType"
                          @update:model-value="handleCLick(item.raw)"
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
                          v-model="item.value.practice"
                          return-object
                          @update:model-value="handleCLick(item.raw)"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row v-if="item.value.questionType === 'Column'">
                      <v-col>
                        <v-btn
                          @click="
                            addToColumnList(item.value.id),
                              handleCLick(item.raw)
                          "
                          >add</v-btn
                        >
                        <draggable
                          tag="ul"
                          :list="item.value.columnRowOptions"
                          class="list-group"
                          handle=".handle"
                          item-key="id"
                          @update="handleCLick(item.raw)"
                        >
                          <template #item="{ element, index }">
                            <li class="list-group-item">
                              <div class="row">
                                <div class="col-1 d-flex align-items-center">
                                  <v-icon
                                    icon="mdi-format-align-justify"
                                    class="handle"
                                  />
                                </div>
                                <div class="col-10">
                                  <input
                                    type="text"
                                    class="form-control"
                                    v-model="element.optionText"
                                    @input="handleCLick(item.raw)"
                                  />
                                </div>
                                <div class="col-1 d-flex align-items-center">
                                  <v-icon
                                    icon="mdi-close"
                                    class="close"
                                    @click="
                                      removeFromColumnList(
                                        index,
                                        item.value.id
                                      ),
                                        handleCLick(item.raw)
                                    "
                                  />
                                </div>
                              </div>
                            </li>
                          </template>
                        </draggable>
                      </v-col>
                    </v-row>
                    <v-row v-if="item.value.questionType === 'Front'">
                      <v-col>
                        <v-row>
                          <v-col>
                            <v-btn
                              @click="
                                addToFrontList(item.value.id),
                                  handleCLick(item.raw)
                              "
                              >add</v-btn
                            >
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <draggable
                              tag="ul"
                              :list="item.value.frontOptions.leftOptions"
                              class="list-group"
                              handle=".handle"
                              item-key="id"
                              @update="handleCLick(item.raw)"
                            >
                              <template #item="{ element, index }">
                                <li class="list-group-item">
                                  <div class="row">
                                    <div
                                      class="col-1 d-flex align-items-center"
                                    >
                                      <v-icon
                                        icon="mdi-format-align-justify"
                                        class="handle"
                                      />
                                    </div>
                                    <div class="col-10">
                                      <input
                                        type="text"
                                        class="form-control"
                                        v-model="element.optionText"
                                        @input="handleCLick(item.raw)"
                                      />
                                    </div>
                                  </div>
                                </li>
                              </template>
                            </draggable>
                          </v-col>
                          <v-col>
                            <draggable
                              tag="ul"
                              :list="item.value.frontOptions.rightOptions"
                              class="list-group"
                              handle=".handle"
                              item-key="id"
                            >
                              <template #item="{ element, index }">
                                <li class="list-group-item">
                                  <div class="row">
                                    <div
                                      class="col-1 d-flex align-items-center"
                                    >
                                      <v-icon
                                        icon="mdi-format-align-justify"
                                        class="handle"
                                      />
                                    </div>
                                    <div class="col-10">
                                      <input
                                        type="text"
                                        class="form-control"
                                        v-model="element.optionAnswer"
                                        @input="handleCLick(item.raw)"
                                      />
                                    </div>
                                    <div
                                      class="col-1 d-flex align-items-center"
                                    >
                                      <v-icon
                                        icon="mdi-close"
                                        class="close"
                                        @click="
                                          removeFromFrontList(
                                            index,
                                            item.value.id
                                          ),
                                            handleCLick(item.raw)
                                        "
                                      />
                                    </div>
                                  </div>
                                </li>
                              </template>
                            </draggable>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row v-if="item.value.questionType === 'Row'">
                      <v-col>
                        <v-btn
                          @click="
                            addToRowList(item.value.id), handleCLick(item.raw)
                          "
                          >add</v-btn
                        >
                        <draggable
                          tag="div"
                          :list="item.value.columnRowOptions"
                          class="list"
                          handle=".handle"
                          item-key="id"
                          @update="handleCLick(item.raw)"
                        >
                          <template #item="{ element, index }">
                            <div class="item">
                              <div class="row">
                                <div class="col-1 d-flex align-items-center">
                                  <v-icon
                                    icon="mdi-format-align-justify"
                                    class="handle"
                                  />
                                </div>
                                <div class="col-10">
                                  <input
                                    type="text"
                                    class="form-control"
                                    v-model="element.optionText"
                                    @input="handleCLick(item.raw)"
                                  />
                                </div>
                                <div class="col-1 d-flex align-items-center">
                                  <v-icon
                                    icon="mdi-close"
                                    class="close"
                                    @click="
                                      removeFromRowList(index, item.value.id),
                                        handleCLick(item.raw)
                                    "
                                  />
                                </div>
                              </div>
                            </div>
                          </template>
                        </draggable>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-right p-2" v-if="edditedQuestions.length > 0">
      <v-btn color="blue-darken-1 mr-2" @click="cancelSave">Cancel</v-btn>
      <v-btn color="blue-darken-1" @click="saveList">Save</v-btn>
    </div>
  </v-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import draggable from "vuedraggable";
import { usePracticeStore } from "../../stores/Practice";
import { RecievedQuiz } from "../../types/Practice";
import { VForm } from "vuetify/lib/components/VForm/index";
import { useQuestionStore } from "../../stores/question";
import { VDataTable } from "vuetify/lib/labs/components";

const optionId = ref<number>(0);
const practiceStore = usePracticeStore();
const questionStore = useQuestionStore();
const expandedRows = ref([]);
const searchQuestion = ref("");
const headers = [
  { title: "Text", value: "questionText", key: "questionText" },
  { title: "Type", value: "questionType", key: "questionType" },
  { title: "Actions", key: "actions", sortable: false },
];

const questions = ref<any>([]);
const edditedQuestions = ref<any>([]);
onMounted(async () => {
  await fillTable();
});

const newQuestionId = ref<number>(0);
const addQuestion = () => {
  const newQuestion = {
    id: (newQuestionId.value++).toString(),
    questionText: "",
    questionType: "Column",
    practice: {},
    frontOptions: [],
    columnRowOptions: [],
  };
  questions.value.push(newQuestion);
  addToEdditedQuestionList("create", newQuestion.id, newQuestion);
};
const addToEdditedQuestionList = (opt: string, id: string, question?: any) => {
  if (opt === "create") {
    // if it is a new question
    edditedQuestions.value.push({...question, opt});
  } else if (opt === "edit") {
    // if it is an edited question
    const index = getEdittedQuestionIndex(id);
    if (index > -1) {
      edditedQuestions.value[index] =
        edditedQuestions.value[index].opt === "create"
          ? { ...question, opt: "create" }
          : { ...question, opt: "edit" };
    } else {
      edditedQuestions.value.push({ ...question, opt });
    }
  } else {
    if (id !== "") {
      edditedQuestions.value.push({ id, opt, type: question.questionType });
    }
  }
};
const getEdittedQuestionIndex = (qId: string) => {
  return edditedQuestions.value.findIndex(
    (question: any) => question.id === qId
  );
};
const removeFromEdittedQuestionList = (qId: string) => {
  const index = getEdittedQuestionIndex(qId);
  edditedQuestions.value.splice(index, 1);
};
const cancelSave = () => {
  fillTable();
  edditedQuestions.value = [];
};

const saveList = async () => {
  await questionStore.updateQuestions(edditedQuestions.value);
  if(questionStore.error === null){
    fillTable();
    edditedQuestions.value =[]
  }

};

const fillTable = async () => {
  await questionStore.getQuestions();
  await practiceStore.getPractices();
  questions.value = questionStore.data.map((question: any) => {
    if (question.questionType === "Front") {
      return {
        ...question,
        frontOptions: {
          leftOptions: question.frontOptions.map((option: any) => ({
            id: option.id,
            optionText: option.optionText,
          })),
          rightOptions: question.frontOptions.map((option: any) => ({
            id: option.id,
            optionAnswer: option.optionAnswer,
          })),
        },
      };
    } else {
      return question;
    }
  });
};

const questionTextRules = ref([
  (value: string) => {
    if (value) return true;

    return "Question is required.";
  },
]);

const deleteQuestion = (qId: string) => {
  const index = getQuestionIndex(qId);
  const question = questions.value[index];
  questions.value.splice(index, 1);
  const num = +qId;
  if (!isNaN(num)) {
    removeFromEdittedQuestionList(qId);
  } else {
    const edittedIndex = getEdittedQuestionIndex(qId);
    if (edittedIndex > -1) edditedQuestions.value.splice(edittedIndex, 1);

    addToEdditedQuestionList("delete", qId, question);
  }
};
const handleCLick = (question: any) => {
  addToEdditedQuestionList("edit", question.id, question);
};

const getQuestionIndex = (qId: string): number =>
  questions.value.findIndex((question: any) => question.id === qId);
const removeFromFrontList = (idx: number, qId: string) => {
  const index = getQuestionIndex(qId);
  questions.value[index].frontOptions.leftOptions.splice(idx, 1);
  questions.value[index].frontOptions.rightOptions.splice(idx, 1);
};
const removeFromColumnList = (idx: number, qId: string) => {
  const index = getQuestionIndex(qId);
  questions.value[index].columnRowOptions.splice(idx, 1);
  handleCLick;
};
const removeFromRowList = (idx: number, qId: string) => {
  const index = getQuestionIndex(qId);
  questions.value[index].columnRowOptions.splice(idx, 1);
};
const addToFrontList = (qId: string) => {
  const index = getQuestionIndex(qId);
  if(!questions.value[index].frontOptions.leftOptions){
    questions.value[index].frontOptions={leftOptions:[], rightOptions:[]};
  }
  questions.value[index].frontOptions.leftOptions.push({
    id: optionId.value,
    optionText: "",
  });
  questions.value[index].frontOptions.rightOptions.push({
    id: optionId.value,
    optionAnswer: "",
  });
};
const addToColumnList = (qId: string) => {
  const index = getQuestionIndex(qId);
  questions.value[index].columnRowOptions.push({
    id: optionId.value,
    optionText: "",
  });
};
const addToRowList = (qId: string) => {
  const index = getQuestionIndex(qId);
  questions.value[index].columnRowOptions.push({
    id: optionId.value,
    optionText: "",
  });
};
</script>

<style>
.list-group {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  border-radius: 0.25rem;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.list-group-item:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.list-group-item i {
  cursor: pointer;
}
.button {
  margin-top: 35px;
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}
input {
  display: inline-block;
  width: 50%;
}
.text {
  margin: 20px;
}
.list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.item {
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 5px;
  cursor: move;
  margin: 0 10px;
}
</style>
