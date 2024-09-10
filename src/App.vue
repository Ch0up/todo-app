<template>
  <div>
    <h1>Ma liste de tâches</h1>
  </div>
  <div>
    <v-card>
      <TodoActions />
    <TodoForm />
    <TodoList />
    </v-card>
   
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TodoForm from "./components/TodoForm.vue";
import TodoList from "./components/TodoList.vue";
import TodoActions from "./components/TodoActions.vue";

export default defineComponent({
  components: {
    TodoForm,
    TodoList,
    TodoActions,
  },
});
</script>
