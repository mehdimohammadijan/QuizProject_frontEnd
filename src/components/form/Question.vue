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
          ref="signupForm"
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
              />
            </v-col>
            <v-col>
              <v-autocomplete
                class="px-2 mx-2 mt-1"
                density="compact"
                label="Type"
                :items="['Column', 'Front', 'Row']"
                v-model="selectedType"
              ></v-autocomplete>
            </v-col>
          </v-row>
         
          <v-row v-if="selectedType === 'Front'">
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
                        <v-icon icon="mdi-format-align-justify" class="handle"  />
                      </div>
                      <div class="col-10">
                        <input
                      type="text"
                      class="form-control"
                      v-model="element.text"
                    />
                      </div>
                      <div class="col-1 d-flex align-items-center">
                        <v-icon icon="mdi-close" class="close" @click="removeAtLeft(index)" />
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
                        <v-icon icon="mdi-format-align-justify" class="handle"  />
                      </div>
                      <div class="col-10">
                        <input
                      type="text"
                      class="form-control"
                      v-model="element.text"
                    />
                      </div>
                      <div class="col-1 d-flex align-items-center">
                        <v-icon icon="mdi-close" class="close" @click="removeAtRight(index)" />
                      </div>
                    </div>
                  </li>
                </template>
              </draggable>
            </v-col>
          </v-row>
          <v-card-actions class="justify-center">
            <v-btn color="indigo" variant="flat" type="submit"
              ><span class="px-6">Create</span></v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import draggable from "vuedraggable";
import { OptionList } from "../../types/Question";
const questionText = ref<string>("");
const selectedType = ref<string>("");
const front_left = ref<string>("");
const front_right = ref<string>("");
const leftList = ref<OptionList[]>([]);
const rightList = ref<OptionList[]>([]);
const dragging = ref<boolean>(false);
const optionId = ref<number>(0);
const questionTextRules = ref([
  (value: string) => {
    if (value) return true;

    return "Question is required.";
  },
]);
const front_leftRules = ref([
  (value: string) => {
    if (value) return true;

    return "Left option is required.";
  },
]);
const front_rightRules = ref([
  (value: string) => {
    if (value) return true;

    return "Right option is required.";
  },
]);
const submitFormHandler = async () => {};
const removeAtRight = (idx: number) => {
  rightList.value.splice(idx, 1);
};
const removeAtLeft = (idx: number) => {
  leftList.value.splice(idx, 1);
};
const addRight = () => {
  rightList.value.push({id: optionId.value, text:""});
};
const addLeft = () => {
  leftList.value.push({id: optionId.value, text:""});
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
  border: 1px solid rgba(0,0,0,.125);
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
</style>
