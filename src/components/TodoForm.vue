<template>
  <div class="w-50">
    <v-form @submit.prevent="addTodo" class="d-flex">
    <v-text-field
      v-model="newTodo"
      :placeholder="parentId ? 'Ajouter une sous-tâche' : 'Ajouter une tâche'"
      variant="outlined"
    ></v-text-field>
    <v-btn type="submit">Ajouter <v-icon>mdi-plus</v-icon></v-btn>
  </v-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useTodoStore } from "../stores/todo";

export default defineComponent({
  props: {
    parentId: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const newTodo = ref("");
    const todoStore = useTodoStore();

    const addTodo = () => {
      if (newTodo.value.trim()) {
        todoStore.addTodo(newTodo.value, props.parentId);
        newTodo.value = "";
      }
    };

    return {
      newTodo,
      addTodo,
    };
  },
});
</script>
