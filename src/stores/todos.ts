import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { Todo } from "../models/todo";

export const useTodoStore = defineStore("todo", () => {
  const todos = ref<Todo[]>([]);

  const loadTodos = () => {
    try {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        todos.value = JSON.parse(storedTodos).map((todo: Todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt
            ? new Date(todo.completedAt)
            : undefined,
          subTasks: todo.subTasks || [],
        }));
      }
    } catch (error) {
      console.error("Failed to load todos from localStorage:", error);
    }
  };

  const saveTodos = () => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos.value));
    } catch (error) {
      console.error("Failed to save todos to localStorage:", error);
    }
  };

  // watch task changes and save them
  watch(todos, saveTodos, { deep: true });

  const addTodo = (name: string, parentId?: number, index?: number) => {
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
        if (
          index !== undefined &&
          index >= 0 &&
          index < parentTodo.subTasks!.length
        ) {
          parentTodo.subTasks!.splice(index, 0, newTodo);
        } else {
          parentTodo.subTasks?.push(newTodo);
        }
      }
    } else {
      if (index !== undefined && index >= 0 && index < todos.value.length) {
        todos.value.splice(index, 0, newTodo);
      } else {
        todos.value.push(newTodo);
      }
    }
  };

  const findTodoById = (
    id: number,
    todoList = todos.value,
  ): Todo | undefined => {
    for (const todo of todoList) {
      if (todo.id === id) return todo;
      const foundInSubTasks = findTodoById(id, todo.subTasks || []);
      if (foundInSubTasks) return foundInSubTasks;
    }
    return undefined;
  };

  const findParentTodoById = (
    id: number,
    todoList = todos.value,
  ): Todo | undefined => {
    for (const todo of todoList) {
      if (todo.subTasks?.some((subTask) => subTask.id === id)) {
        return todo;
      }
      const foundInSubTasks = findParentTodoById(id, todo.subTasks || []);
      if (foundInSubTasks) return foundInSubTasks;
    }
    return undefined;
  };

  const toggleTodo = (id: number) => {
    const todo = findTodoById(id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date() : undefined;

      if (todo.subTasks?.length) {
        todo.subTasks.forEach((subTask) => {
          subTask.completed = todo.completed;
          subTask.completedAt = todo.completed ? new Date() : undefined;
        });
      }

      updateTodoParent(id);
    }
  };

  // Update the state of the parent task recursively
  const updateTodoParent = (id: number) => {
    const parentTodo = findParentTodoById(id);
    if (parentTodo) {
      if (parentTodo.subTasks?.every((subTask) => subTask.completed)) {
        parentTodo.completed = true;
        parentTodo.completedAt = new Date();
      } else {
        parentTodo.completed = false;
        parentTodo.completedAt = undefined;
      }
      updateTodoParent(parentTodo.id);
    }
  };

  const removeTodo = (id: number, todoList = todos.value) => {
    const index = todoList.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todoList.splice(index, 1);
    } else {
      todoList.forEach((todo) => {
        if (todo.subTasks) {
          removeTodo(id, todo.subTasks);
        }
      });
    }
  };

  const editTodo = (id: number, newName: string) => {
    const todo = findTodoById(id);
    if (todo && todo.name) {
      todo.name = newName;
    }
  };

  // Load tasks during store initialization
  loadTodos();

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    editTodo,
    saveTodos,
  };
});
