<template>
  <div class="ma-auto">
    <v-form
      @submit.prevent="addTodoAtPosition"
      class="d-flex align-center ma-5"
    >
      <v-text-field
        v-model="newTodo"
        :placeholder="parentId ? 'Add subtask' : 'Add task'"
        variant="solo"
        clearable
        @keyup.enter="addTodoAtPosition"
      >
      </v-text-field>
      <div v-if="todos?.length">
        <v-text-field
          v-model="position"
          label="Position"
          type="number"
          min="0"
          :max="parentId ? subtask?.length : todos?.length"
          variant="solo"
        >
        </v-text-field>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useTodoStore } from "../stores/todos";

export default defineComponent({
  props: {
    parentId: {
      type: Number,
      required: false,
    },
    subtask: {
      type: Array,
      required: false,
    },
  },
  setup(props, { emit }) {
    const newTodo = ref("");
    const position = ref(0);
    const todoStore = useTodoStore();
    const { todos, addTodo } = todoStore;

    const addTodoAtPosition = () => {
      if (newTodo.value.trim()) {
        addTodo(newTodo.value, props.parentId, position.value);
        newTodo.value = "";
        position.value = 0;
        emit("subtask-added");
      }
    };

    return {
      newTodo,
      position,
      todos,
      addTodo,
      addTodoAtPosition,
    };
  },
});
</script>
