<template>
    <div>
      <input type="file" @change="uploadTasks" />
      <button @click="downloadTasks">Télécharger les tâches</button>
    </div>
  </template>
  
  <script>
  import { useTaskStore } from '../stores/todo';
  
  const taskStore = useTaskStore();
  </script>