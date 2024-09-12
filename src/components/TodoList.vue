<template>
  <div v-if="todos && todos.length" class="draggable-content">
    <draggable :list="todos" @end="saveTodos" animation="200">
      <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
    </draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useTodoStore } from "../stores/todos";
import { VueDraggableNext } from "vue-draggable-next";
import TodoItem from "./TodoItem.vue";

export default defineComponent({
  components: {
    TodoItem,
    draggable: VueDraggableNext,
  },
  setup() {
    const todoStore = useTodoStore();
    const { todos, saveTodos } = todoStore;

    return {
      todos,
      saveTodos,
    };
  },
});
</script>
