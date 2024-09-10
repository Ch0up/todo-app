<template>
  <v-form @submit.prevent="addTodo" class="d-flex">
    <v-text-field
        v-model="newTodo"
        :placeholder="parentId ? 'Ajouter une sous-tâche' : 'Ajouter une tâche'"
        type="text"
    ></v-text-field>
    <v-btn type="submit">Ajouter</v-btn>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useTodoStore } from '../stores/todo';

export default defineComponent({
  props: {
    parentId: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const newTodo = ref('');
    const todoStore = useTodoStore();

    const addTodo = () => {
      if (newTodo.value.trim()) {
        todoStore.addTodo(newTodo.value, props.parentId);
        newTodo.value = '';
      }
    };

    return {
      newTodo,
      addTodo,
    };
  },
});
</script>
