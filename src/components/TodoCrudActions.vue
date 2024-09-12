<template>
  <v-menu v-if="!isEditing" location="start">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" class="mt-n2">
        <v-icon icon="mdi-dots-vertical"></v-icon>
      </v-btn>
    </template>

    <div class="d-flex">
      <v-btn @click="startEdit" color="primary" class="mx-2">
        <v-tooltip activator="parent" location="bottom">Edit</v-tooltip
        ><v-icon>mdi-pencil</v-icon></v-btn
      >

      <v-btn @click="removeTodo(todo.id)" color="error">
        <v-tooltip activator="parent" location="bottom">Delete</v-tooltip
        ><v-icon>mdi-trash-can</v-icon></v-btn
      >

      <v-btn
        @click="openSubtaskDialog(todo.name)"
        color="warning"
        class="mx-2"
        :disabled="todo.completed"
      >
        <v-tooltip activator="parent" location="bottom">Add</v-tooltip>
        <v-icon>mdi-plus</v-icon></v-btn
      >
    </div>
  </v-menu>
  <div v-else>
    <v-btn @click="saveEdit" color="success" variant="elevated" class="mr-2">
      <v-tooltip activator="parent" location="bottom">Save</v-tooltip>
      <v-icon>mdi-checkbox-marked-circle</v-icon></v-btn
    >
    <v-btn @click="cancelEdit" variant="elevated" color="error">
      <v-tooltip activator="parent" location="bottom">Cancel</v-tooltip
      ><v-icon>mdi-cancel</v-icon></v-btn
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Todo } from "../models/todo";

export default defineComponent({
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
    todo: {
      type: Object as () => Todo,
      required: true,
    },
  },
  emits: [
    "startEdit",
    "removeTodo",
    "openSubtaskDialog",
    "saveEdit",
    "cancelEdit",
  ],
  setup(_, { emit }) {
    const startEdit = () => emit("startEdit");
    const removeTodo = (id: number) => emit("removeTodo", id);
    const openSubtaskDialog = (name: string) => emit("openSubtaskDialog", name);
    const saveEdit = () => emit("saveEdit");
    const cancelEdit = () => emit("cancelEdit");

    return {
      startEdit,
      removeTodo,
      openSubtaskDialog,
      saveEdit,
      cancelEdit,
    };
  },
});
</script>
