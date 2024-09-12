<template>
  <h1>My to-do list</h1>
  <v-divider class="my-5"></v-divider>

  <template class="d-flex justify-end pr-5">
    <TodoDownloadActions />
  </template>
  <TodoForm />
  <TodoList />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TodoForm from "./components/TodoForm.vue";
import TodoList from "./components/TodoList.vue";
import TodoDownloadActions from "./components/TodoDownloadActions.vue";

export default defineComponent({
  components: {
    TodoForm,
    TodoList,
    TodoDownloadActions,
  },
});
</script>
