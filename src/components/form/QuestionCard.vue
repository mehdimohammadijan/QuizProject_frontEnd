<template>
  <v-card class="elevation-12 mx-auto mt-10" max-width="900">
    <v-toolbar>
      <v-toolbar-title> {{ localQuestion.questionText }} </v-toolbar-title>
    </v-toolbar>
    <v-card-text v-if="localQuestion.questionType === 'Column'">
      <draggable
        :list="question.columnRowOptions"
        item-key="id"
        ghost-class="ghost"
        @end="end"
      >
        <template #item="{ element }">
          <div
            class="list-group-item"
            :style="element.correct ? 'border-color: green' : ''"
          >
            {{ element.optionText }}
          </div>
        </template>
      </draggable>
    </v-card-text>
    <v-card-text v-if="question.questionType === 'Row'">
      <draggable
        :list="localQuestion.columnRowOptions"
        item-key="id"
        ghost-class="ghost"
        @end="end"
        class="d-flex"
      >
        <template #item="{ element }">
          <div
            class="list-group-item list-group-item-horizontal"
            :style="element.correct ? 'border-color: green' : ''"
          >
            {{ element.optionText }}
          </div>
        </template>
      </draggable>
    </v-card-text>
    <v-card-text v-if="question.questionType === 'Front'">
      <v-row>
        <v-col>
          <draggable
            :list="leftOptions"
            item-key="id"
            ghost-class="ghost"
            disabled="true"
          >
            <template #item="{ element }">
              <div
                class="list-group-item list-group-item-horizontal"
                :style="element.correct ? 'border-color: green' : ''"
              >
                {{ element.optionText }}
              </div>
            </template>
          </draggable>
        </v-col>
        <v-col>
          <draggable
            :list="rightOptions"
            item-key="id"
            ghost-class="ghost"
            @end="endFront"
          >
            <template #item="{ element }">
              <div
                class="list-group-item list-group-item-horizontal"
                :style="element.correct ? 'border-color: green' : ''"
              >
                {{ element.optionAnswer }}
              </div>
            </template>
          </draggable>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import shuffleArray from "../../composables/shuffle";
const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
});
const localQuestion = ref({ ...props.question });
const leftOptions = ref(
  props.question.frontOptions.map((o) => ({
    id: o.id,
    optionText: o.optionText,
  }))
);
const rightOptions = ref(
  props.question.frontOptions.map((o) => ({
    id: o.id,
    optionAnswer: o.optionAnswer,
    correct: false
  }))
);
const emit = defineEmits(["updateQuestion"]);

const { shuffle } = shuffleArray();
if (localQuestion.value.questionType === "Front") {
  shuffle(localQuestion.value.frontOptions);
} else {
  shuffle(localQuestion.value.columnRowOptions);
}

watch(
  () => props.question,
  (newValue) => {
    localQuestion.value = { ...newValue };
    if (localQuestion.value.questionType === "Front") {
      leftOptions.value = localQuestion.value.frontOptions.map((o) => ({
      id: o.id,
      optionText: o.optionText,
      correct: false
        }));
        rightOptions.value = localQuestion.value.frontOptions.map((o) => ({
      id: o.id,
      optionAnswer: o.optionAnswer,
      correct: false
        }));
      if (
        !(
          localQuestion.value.frontOptions[0].correct === true ||
          localQuestion.value.frontOptions[0].correct === false
        )
      ) {
        shuffle(rightOptions.value);
      }
    } else {
      if (
        !(
          localQuestion.value.columnRowOptions[0].correct === true ||
          localQuestion.value.columnRowOptions[0].correct === false
        )
      ) {
        shuffle(localQuestion.value.columnRowOptions);
      }
    }
  }
);
const endFront = () => {
  for (
    let index = 0;
    index < localQuestion.value.frontOptions.length;
    index++
  ) {
    const optionRef = rightOptions.value[index];
    optionRef.correct = optionRef.id === leftOptions.value[index].id ? true : false;
  }
  localQuestion.value = {...localQuestion.value, leftOptions, rightOptions}
   emit("updateQuestion", localQuestion.value);
};

const end = () => {
  for (
    let index = 0;
    index < localQuestion.value.columnRowOptions.length;
    index++
  ) {
    const optionRef = localQuestion.value.columnRowOptions[index];
    optionRef.correct = index === optionRef.optionPosition ? true : false;
  }
  emit("updateQuestion", localQuestion.value);
};
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group-item {
  position: relative;
  display: block;
  margin-top: 2px;
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border: 2px solid rgba(0, 0, 0, 0.125);
}
.list-group-item-horizontal {
  margin-left: 2px;
}
</style>
