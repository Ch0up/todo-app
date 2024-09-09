<template>
  <li>
    <input type="checkbox" :checked="todo.completed" @change="toggleTodo(todo.id)" />
    <span :class="{ completed: todo.completed }">{{ todo.name }}</span>
    <button @click="removeTodo(todo.id)">Supprimer</button>
    <button @click="editTodoName(todo.id)">Éditer</button>
    <TodoForm :parentId="todo.id" />
    <ul v-if="todo.subTasks?.length">
      <TodoItem v-for="subTask in todo.subTasks" :key="subTask.id" :todo="subTask" />
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTodoStore } from '../stores/todo';
import TodoForm from './TodoForm.vue';

export default defineComponent({
  components: {
    TodoForm,
    TodoItem: () => import('./TodoItem.vue'), // Recursive Import
  },
  props: {
    todo: {
      type: Object as () => Todo,
      required: true,
    },
  },
  setup(props) {
    const todoStore = useTodoStore();
    const { toggleTodo, removeTodo, editTodo } = todoStore;

    const editTodoName = (id: number) => {
      const newName = prompt('Nouveau nom de la tâche :');
      if (newName) {
        editTodo(id, newName);
      }
      // TODO => need to change to put in a input instead of prompt
    };

    return {
      toggleTodo,
      removeTodo,
      editTodoName,
    };
  },
});
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}
</style>
