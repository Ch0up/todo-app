<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo" :placeholder="parentId ? 'Ajouter une sous-tâche' : 'Ajouter une tâche'" />
    <button type="submit">{{ parentId ? 'Ajouter sous-tâche' : 'Ajouter tâche' }}</button>
  </form>
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
