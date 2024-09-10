<template>
  <li :style="{ paddingLeft: `${depth * 20}px` }">

    <input 
      type="checkbox" 
      :checked="!!todo.completed" 
      :disabled="!!(todo.subTasks?.length && !areAllSubtasksCompleted(todo))" 
      @change="toggleTodo(todo.id)" 
    />

    <v-text-field :disabled="true" :class="{ completed: todo.completed }">{{ todo.name }}</v-text-field>
    <span v-if="todo.completedAt">Complété le : {{ todo.completedAt }}</span>
    <span>Créé le : {{ todo.createdAt }}</span>

    <v-btn @click="removeTodo(todo.id)">Supprimer</v-btn>
    <v-btn @click="editTodoName(todo.id)">Éditer</v-btn>
    
    <TodoForm :parentId="todo.id" />
    
    <ul v-if="todo.subTasks && todo.subTasks.length">
      <draggable :list="todo.subTasks" @end="saveTodos" animation="200">
        <TodoItem 
          v-for="subTask in todo.subTasks" 
          :key="subTask.id" 
          :todo="subTask" 
          :depth="depth + 1"
        />
      </draggable>
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { useTodoStore, Todo } from '../stores/todo';
import TodoForm from './TodoForm.vue';
import { VueDraggableNext } from 'vue-draggable-next';

const TodoItem = defineAsyncComponent(() => import('./TodoItem.vue')) // recurcive import

export default defineComponent({
  components: {
    TodoForm,
    draggable: VueDraggableNext,
  },
  props: {
    todo: {
      type: Object as () => Todo,
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const todoStore = useTodoStore();
    const {editTodo, removeTodo, saveTodos, toggleTodo} = todoStore;


    const areAllSubtasksCompleted = (todo: Todo): boolean => {
      if (!todo.subTasks?.length) return true;
      return todo.subTasks.every(subTask => subTask.completed);
    };


    const editTodoName = (id: number) => {
      const newName = prompt('Nouveau nom de la tâche :');
      if (newName) {
        editTodo(id, newName);
      }
      // TODO => need to change to put in a input instead of prompt
    };

    return {
      areAllSubtasksCompleted,
      editTodoName,
      removeTodo,
      saveTodos,
      toggleTodo,
    };
  },
});
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}

li {
  list-style-type: none;
}
</style>
