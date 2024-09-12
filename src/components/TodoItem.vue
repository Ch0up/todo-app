<template>
  <li :style="{ paddingLeft: `${depth * 20}px` }">
    <div class="d-flex justify-space-around ml-12 align-center">
      <div class="d-flex w-66">
        <input
          type="checkbox"
          :checked="!!todo.completed"
          :disabled="isCheckboxDisabled"
          @change="toggleTodo(todo.id)"
          class="mr-4"
          :title="
            isCheckboxDisabled ? 'You need to complete subtask before' : ''
          "
        />

        <v-text-field
          ref="editableNameInput"
          :disabled="!isEditing"
          v-model="editableName"
          autofocus
          variant="solo"
          :class="{ completed: todo.completed }"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          clearable
        />
      </div>

      <TodoCrudActions
        :isEditing="isEditing"
        :todo="todo"
        @startEdit="startEdit"
        @removeTodo="removeTodo"
        @openSubtaskDialog="openSubtaskDialog"
        @saveEdit="saveEdit"
        @cancelEdit="cancelEdit"
      />
    </div>

    <span>Created on : {{ formatedDate(todo.createdAt) }} </span>
    <span v-if="todo.completedAt">
      Completed at : {{ formatedDate(todo.completedAt) }}
    </span>

    <v-dialog v-model="isSubtaskDialogOpen" max-width="600">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>Add subtask to {{ todo.name }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <TodoForm
              :parentId="todo.id"
              :subtask="todo.subTasks"
              @subtask-added="closeSubtaskDialog"
            />
          </v-card-text>

          <template v-slot:actions>
            <v-btn
              class="ml-auto"
              text="Close"
              @click="isActive.value = false"
            ></v-btn>
          </template>
        </v-card>
      </template>
    </v-dialog>

    <ul v-if="todo.subTasks && todo.subTasks.length" class="draggable-content">
      <draggable :list="todo.subTasks" @end="saveTodos" animation="200">
        <TodoItem
          v-for="subTask in todo.subTasks"
          :key="subTask.id"
          :todo="subTask"
          :depth="depth + 2"
        />
      </draggable>
    </ul>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  nextTick,
  computed,
} from "vue";
import { useTodoStore } from "../stores/todos";
import { VueDraggableNext } from "vue-draggable-next";
import { Todo } from "../models/todo";
import TodoForm from "./TodoForm.vue";
import TodoCrudActions from "./TodoCrudActions.vue";

export default defineComponent({
  components: {
    TodoForm,
    TodoCrudActions,
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
    const isCheckboxDisabled = computed(() => {
      return !!(
        props.todo.subTasks?.length && !areAllSubtasksCompleted(props.todo)
      );
    });
    const isSubtaskDialogOpen = ref(false);
    const editableNameInput = ref<HTMLInputElement | null>(null);

    const todoStore = useTodoStore();
    const { editTodo, removeTodo, saveTodos, toggleTodo } = todoStore;

    const areAllSubtasksCompleted = (todo: Todo): boolean => {
      if (!todo.subTasks?.length) return true;
      return todo.subTasks.every((subTask) => subTask.completed);
    };

    const isEditing = ref(false);
    const editableName = ref(props.todo.name);

    const startEdit = async () => {
      isEditing.value = true;
      editableName.value = props.todo.name;
      await nextTick();
      if (editableNameInput.value) editableNameInput.value.focus();
    };

    const saveEdit = () => {
      if (editableName.value && editableName.value.trim()) {
        editTodo(props.todo.id, editableName.value);
      } else {
        console.error("This field can't be empty");
        cancelEdit();
      }
      isEditing.value = false;
    };

    const cancelEdit = () => {
      isEditing.value = false;
      editableName.value = props.todo.name;
    };

    const selectedSubtaskName = ref("");

    const openSubtaskDialog = (name: string) => {
      selectedSubtaskName.value = name;
      isSubtaskDialogOpen.value = true;
    };

    const closeSubtaskDialog = () => {
      isSubtaskDialogOpen.value = false;
    };

    const formatedDate = (myDate: Date) => {
      return new Date(myDate).toLocaleString("en-US");
    };

    return {
      areAllSubtasksCompleted,
      removeTodo,
      saveTodos,
      formatedDate,
      toggleTodo,
      startEdit,
      saveEdit,
      cancelEdit,
      editableName,
      isEditing,
      isCheckboxDisabled,
      selectedSubtaskName,
      isSubtaskDialogOpen,
      openSubtaskDialog,
      closeSubtaskDialog,
      editableNameInput,
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

input[type="checkbox"] {
  width: 1.5em;
}

input[type="checkbox"]:disabled:hover {
  cursor: not-allowed;
}
</style>
