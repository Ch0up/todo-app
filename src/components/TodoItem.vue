<template>
  <li :style="{ paddingLeft: `${depth * 20}px` }">
    <div class="d-flex">
      <input type="checkbox" :checked="!!todo.completed"
        :disabled="!!(todo.subTasks?.length && !areAllSubtasksCompleted(todo))" @change="toggleTodo(todo.id)" />

      <v-text-field :disabled="!isEditing" v-model="editableName" autofocus variant="outlined"
        :class="{ completed: todo.completed }" />
    </div>

    <span>Créé le : {{ formatedDate(todo.createdAt) }} </span>
    <span v-if="todo.completedAt">
      Complété le : {{ formatedDate(todo.completedAt) }}
    </span>

    <v-btn @click="removeTodo(todo.id)" color="error"><v-icon>mdi-trash-can</v-icon></v-btn>
    <v-btn v-if="!isEditing" @click="startEdit" color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
    <div v-if="isEditing">
      <v-btn @click="saveEdit" color="secondary">Sauvegarder
        <v-icon icon="mdi-checkbox-marked-circle" end></v-icon></v-btn>
      <v-btn @click="cancelEdit" color="tertiary">
        Annuler
        <v-icon icon="mdi-minus-circle" end></v-icon>
      </v-btn>
    </div>

    <TodoForm :parentId="todo.id" />

    <ul v-if="todo.subTasks && todo.subTasks.length" class="draggable-content">
      <draggable :list="todo.subTasks" @end="saveTodos" animation="200">
        <TodoItem v-for="subTask in todo.subTasks" :key="subTask.id" :todo="subTask" :depth="depth + 1" />
      </draggable>
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from "vue";
import { useTodoStore, Todo } from "../stores/todo";
import { VueDraggableNext } from "vue-draggable-next";
import TodoForm from "./TodoForm.vue";

const TodoItem = defineAsyncComponent(() => import("./TodoItem.vue")); // recurcive import

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
  setup(props) {
    const todoStore = useTodoStore();
    const { editTodo, removeTodo, saveTodos, toggleTodo } = todoStore;

    const formatedDate = (myDate: Date) => {
      return new Date(myDate).toLocaleString();
    };

    const areAllSubtasksCompleted = (todo: Todo): boolean => {
      if (!todo.subTasks?.length) return true;
      return todo.subTasks.every((subTask) => subTask.completed);
    };

    const isEditing = ref(false);
    const editableName = ref(props.todo.name);

    const startEdit = () => {
      console.log("props => ", props)
      isEditing.value = true;
      editableName.value = props.todo.name;
    };

    const saveEdit = () => {
      if (editableName.value.trim()) {
        editTodo(props.todo.id, editableName.value);
      }
      isEditing.value = false;
    };

    const cancelEdit = () => {
      isEditing.value = false;
      editableName.value = props.todo.name;
    };

    const editTodoName = (id: number) => {
      const newName = prompt("Nouveau nom de la tâche :");
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
      formatedDate,
      toggleTodo,
      startEdit,
      saveEdit,
      cancelEdit,
      editableName,
      isEditing,
    };
  },
});
</script>

<style>
.completed {
  text-decoration: line-through;
}

li {
  list-style-type: none;
}

input[type="checkbox"]:checked+label:after {
  content: '✔';
  position: absolute;
  top: 0px;
  left: 3px;
  font-size: 19px;
  line-height: 1.3;
  color: #09ad7e;
  transition: all .2s;
}
</style>