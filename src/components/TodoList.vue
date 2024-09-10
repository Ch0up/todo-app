<template>
  <draggable :list="todos" @end="saveTodos" animation="200">
      <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
  </draggable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTodoStore } from '../stores/todo';
import TodoItem from './TodoItem.vue';
import { VueDraggableNext } from 'vue-draggable-next';

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
