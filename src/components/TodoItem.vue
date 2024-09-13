<template>
  <div :style="{ paddingLeft: `${depth * 20}px` }">
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-card
          v-bind="props"
          :style="isHovering ? 'background-color: rgb(230, 229, 229)' : ''"
          class="ma-4 pa-6 d-flex justify-space-between align-center"
        >
          <v-card-title class="d-flex">
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
            <div v-if="!isEditing" :class="{ completed: todo.completed }">
              {{ editableName }}
            </div>
            <v-text-field
              v-else
              ref="editableNameInput"
              v-model="editableName"
              variant="outlined"
              :class="{ completed: todo.completed }"
              @keyup.enter="saveEdit"
              @keyup.esc="cancelEdit"
              clearable
              autofocus
              min-width="300"
            />
          </v-card-title>
          <div class="d-flex align-center">
            <v-card-subtitle>
              <div>Created : {{ formatedDate(todo.createdAt) }}</div>
              <div v-if="todo.completedAt">
                Completed : {{ formatedDate(todo.completedAt) }}
              </div>
            </v-card-subtitle>
            <v-card-actions class="align-end">
              <TodoCrudActions
                :isEditing="isEditing"
                :todo="todo"
                @startEdit="startEdit"
                @removeTodo="removeTodo"
                @openSubtaskDialog="openSubtaskDialog"
                @saveEdit="saveEdit"
                @cancelEdit="cancelEdit"
              />
            </v-card-actions>
          </div>
        </v-card>
      </template>
    </v-hover>

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
              variant="elevated"
              @click="isActive.value = false"
            ></v-btn>
          </template>
        </v-card>
      </template>
    </v-dialog>

    <div v-if="todo.subTasks && todo.subTasks.length" class="draggable-content">
      <draggable :list="todo.subTasks" @end="saveTodos" animation="200">
        <TodoItem
          v-for="subTask in todo.subTasks"
          :key="subTask.id"
          :todo="subTask"
          :depth="depth + 2"
        />
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, computed } from "vue";
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
  color: grey;
}

input[type="checkbox"] {
  width: 1em;
}

input[type="checkbox"]:disabled:hover {
  cursor: not-allowed;
}
</style>
