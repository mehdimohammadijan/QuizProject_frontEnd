<template>
  <div>
    <v-card class="elevation-12 mx-auto mt-10" max-width="900">
      <v-toolbar dark color="grey-lighten-1">
        <v-toolbar-title>Create Question</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form
          class="ml--5"
          @submit.prevent="submitFormHandler"
          ref="questionForm"
        >
          <v-row no-gutters>
            <v-col cols="9">
              <v-text-field
                variant="underlined"
                prepend-inner-icon="mdi-help"
                label="Question"
                type="text"
                placeholder="Question"
                :rules="questionTextRules"
                v-model="questionText"
                clearable
                @update:model-value="handleInput"
              />
            </v-col>
            <v-col>
              <v-autocomplete
                class="px-2 mx-2 mt-1"
                density="compact"
                label="Type"
                :items="['Column', 'Front', 'Row']"
                v-model="questionType"
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
                return-object
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row v-if="questionType === 'Column'">
            <v-col>
              <v-btn @click="addToColumnList">add</v-btn>
              <draggable
                tag="ul"
                :list="columnList"
                class="list-group"
                handle=".handle"
                item-key="id"
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
                          v-model="element.text"
                        />
                      </div>
                      <div class="col-1 d-flex align-items-center">
                        <v-icon
                          icon="mdi-close"
                          class="close"
                          @click="removeFromColumnList(index)"
                        />
                      </div>
                    </div>
                  </li>
                </template>
              </draggable>
            </v-col>
          </v-row>
          <v-row v-if="questionType === 'Front'">
            <v-col>
              <v-btn @click="addLeft">add</v-btn>
              <draggable
                tag="ul"
                :list="leftList"
                class="list-group"
                handle=".handle"
                item-key="id"
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
                          v-model="element.text"
                        />
                      </div>
                      <div class="col-1 d-flex align-items-center">
                        <v-icon
                          icon="mdi-close"
                          class="close"
                          @click="removeAtLeft(index)"
                        />
                      </div>
                    </div>
                  </li>
                </template>
              </draggable>
            </v-col>
            <v-col>
              <v-btn @click="addRight">add</v-btn>
              <draggable
                tag="ul"
                :list="rightList"
                class="list-group"
                handle=".handle"
                item-key="id"
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
                          v-model="element.text"
                        />
                      </div>
                      <div class="col-1 d-flex align-items-center">
                        <v-icon
                          icon="mdi-close"
                          class="close"
                          @click="removeAtRight(index)"
                        />
                      </div>
                    </div>
                  </li>
                </template>
              </draggable>
            </v-col>
          </v-row>
          <v-row v-if="questionType === 'Row'">
            <v-col>
              <v-btn @click="addToRowList">add</v-btn>
              <draggable
                tag="div"
                :list="rowList"
                class="list"
                handle=".handle"
                item-key="id"
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
                          v-model="element.text"
                        />
                      </div>
                      <div class="col-1 d-flex align-items-center">
                        <v-icon
                          icon="mdi-close"
                          class="close"
                          @click="removeFromRowList(index)"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </v-col>
          </v-row>
          <v-card-actions class="justify-center">
            <v-btn
              color="indigo"
              variant="flat"
              type="submit"
              :loading="questionStore.isLoading"
              ><span class="px-6">Create</span></v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import draggable from "vuedraggable";
import { OptionList, CreateQuestion, DisplayQuestion } from "../../types/Question";
import { usePracticeStore } from "../../stores/Practice";
import { SelectedQuiz, RecievedQuiz } from '../../types/Practice';
import { VForm } from "vuetify/lib/components/VForm/index";
import { useQuestionStore } from "../../stores/question";



const questionText = ref<string>("");
const questionType = ref<string>("");
const leftList = ref<OptionList[]>([]);
const rightList = ref<OptionList[]>([]);
const columnList = ref<OptionList[]>([]);
const rowList = ref<OptionList[]>([]);
const optionId = ref<number>(0);
const selectedQuiz = ref<SelectedQuiz>();
const questionForm = ref<VForm | null>(null);
const practiceStore = usePracticeStore();
const questionStore = useQuestionStore();
const headers= [
  { text: 'Text', value: 'text' },
  { text: 'Type', value: 'type' },
];

const questions = ref<DisplayQuestion[]>([]);
onMounted(() => {
  fillTable();
});
const fillTable = async () => {
  await questionStore.getQuestions();
  initialize();
}
const initialize = () => {
  questions.value = questionStore.data.map((question: any) => {
    return {
      id: question.id,
      text: question.questionText,
      type: question.questionType,
    };
  });
};

const questionTextRules = ref([
  (value: string) => {
    if (value) return true;

    return "Question is required.";
  },
]);

onMounted(async () => {
  await practiceStore.getPractices();
});

const handleInput = () => {
  console.log('Input value changed');
};
const submitFormHandler = async () => {
  const isValid = await questionForm.value?.validate();
  let question: CreateQuestion = {
    type: '',
    quiz: '',
    questionText: '',
    options: []
} ;
  if (isValid !== undefined) {
    if (isValid.valid) {
      if(questionType.value === 'Column'){
        if(columnList.value.length === 0){
          console.log('Column type question must has a value!');
          return;
        }
        question = {
        type: questionType.value,
        quiz: selectedQuiz.value!.id,
        questionText: questionText.value,
        options: columnList.value.map(option => option.text)
      }
    }
      else if(questionType.value === 'Row'){
        if(rowList.value.length === 0){
          console.log('Row type question must has a value!');
          return;
        }
        question = {
        type: questionType.value,
        quiz: selectedQuiz.value!.id,
        questionText: questionText.value,
        options: rowList.value.map(option => option.text)
      }
      }else if(questionType.value === 'Front') {
        if(leftList.value.length === 0 || rightList.value.length === 0 || leftList.value.length !== rightList.value.length){
          console.log('Front type question is invalid!');
          return;
        }
        question = {
        type: questionType.value,
        quiz: selectedQuiz.value!.id,
        questionText: questionText.value,
        options: {
          leftOption: leftList.value.map(option => option.text),
          rightOption: rightList.value.map(option => option.text)
        }
      }
      }
      await questionStore.createQuestion(question);
      if (!questionStore.error) {
        console.log('successfully added');
      }
    }
  }
};
const removeAtRight = (idx: number) => {
  rightList.value.splice(idx, 1);
};
const removeAtLeft = (idx: number) => {
  leftList.value.splice(idx, 1);
};
const removeFromColumnList = (idx: number) => {
  columnList.value.splice(idx, 1);
}
const removeFromRowList = (idx: number) => {
  rowList.value.splice(idx, 1);
}
const addRight = () => {
  rightList.value.push({id: optionId.value, text:""});
};
const addLeft = () => {
  leftList.value.push({id: optionId.value, text:""});
};
const addToColumnList = () => {
  columnList.value.push({id: optionId.value, text:""});
};
const addToRowList = () => {
  rowList.value.push({id: optionId.value, text:""});
}
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
