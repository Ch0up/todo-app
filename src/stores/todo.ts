import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Todo {
  id: number;
  name: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  subTasks?: Todo[];
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([]);

  const addTodo = (name: string, parentId?: number) => {
    const newTodo: Todo = {
      id: Date.now(),
      name,
      completed: false,
      createdAt: new Date(),
      subTasks: [],
    };

    if (parentId) {
      const parentTodo = findTodoById(parentId);
      if (parentTodo) {
        parentTodo.subTasks?.push(newTodo);
      }
    } else {
      todos.value.push(newTodo);
    }
  };

  const findTodoById = (id: number, todoList = todos.value): Todo | undefined => {
    for (const todo of todoList) {
      if (todo.id === id) return todo;
      const foundInSubTasks = findTodoById(id, todo.subTasks || []);
      if (foundInSubTasks) return foundInSubTasks;
    }
    return undefined;
  };

  const toggleTodo = (id: number) => {
    const todo = findTodoById(id);
    if (todo) {
      if (todo.subTasks?.length && !todo.subTasks.every(subTask => subTask.completed)) {
        alert("Vous ne pouvez pas compléter cette tâche tant que toutes les sous-tâches ne sont pas complétées.");
        return;
      }
      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date() : undefined;
      if (todo.completed && todo.subTasks?.length) {
        todo.subTasks.forEach(subTask => {
          subTask.completed = true;
          subTask.completedAt = new Date();
        });
      }
    }
  };

  const removeTodo = (id: number, todoList = todos.value) => {
    const index = todoList.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todoList.splice(index, 1);
    } else {
      todoList.forEach(todo => {
        if (todo.subTasks) {
          removeTodo(id, todo.subTasks);
        }
      });
    }
  };

  const editTodo = (id: number, newName: string) => {
    const todo = findTodoById(id);
    if (todo) {
      todo.name = newName;
    }
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    editTodo,
  };
});
