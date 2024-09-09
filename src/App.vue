<template>
  <div>
    <TodoForm />
    <TodoList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TodoForm from './components/TodoForm.vue';
import TodoList from './components/TodoList.vue';

export default defineComponent({
  components: {
    TodoForm,
    TodoList,
  },
});
</script>
