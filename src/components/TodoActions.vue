<template>
  <div>
    <v-btn @click="downloadTodos" color="primary"><v-icon>mdi-download</v-icon>Télécharger la liste</v-btn>
    <v-btn @click="triggerFileInput">
      <v-icon>mdi-upload</v-icon>
      Charger une liste
      <input type="file" ref="fileInput" @change="uploadTodos" accept=".json" style="display: none;"/>
    </v-btn>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import { useTodoStore, Todo } from "../stores/todo";

export default defineComponent({
  setup() {

    const fileInput = ref<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    const todoStore = useTodoStore();
    const { todos, saveTodos } = todoStore;

    const downloadTodos = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(todos));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "todos.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    const uploadTodos = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            const uploadedTodos = JSON.parse(e.target.result as string);
            todos.length = 0;
            uploadedTodos.forEach((todo: Todo) => {
              todos.push({
                ...todo,
                createdAt: new Date(todo.createdAt),
                completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
                subTasks: todo.subTasks || [],
              });
            });
            saveTodos();
          }
        };
        reader.readAsText(file);
      }
    };


    return {
      triggerFileInput,
      downloadTodos,
      uploadTodos,fileInput
    };
  },
});
</script>