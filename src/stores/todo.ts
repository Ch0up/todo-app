import { defineStore } from "pinia";
import { ref, watch } from "vue";

export interface Todo {
  id: number;
  name: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  subTasks?: Todo[];
}

export const useTodoStore = defineStore("todo", () => {
  const todos = ref<Todo[]>([]);

  const loadTodos = () => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      todos.value = JSON.parse(storedTodos).map((todo: Todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
        subTasks: todo.subTasks || [],
      }));
    }
  };

  const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos.value));
  };

  // watch task changes and save them
  watch(todos, saveTodos, { deep: true });

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

  const findTodoById = (
    id: number,
    todoList = todos.value
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
    todoList = todos.value
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
    console.log("id =>>", id)
    const todo = findTodoById(id);
    if (todo) {
      if (
        todo.subTasks?.length &&
        !todo.subTasks.every((subTask) => subTask.completed)
      ) {
        alert(
          "Vous ne pouvez pas compléter cette tâche tant que toutes les sous-tâches ne sont pas complétées."
        );
        return;
      }

      console.log("todo =>>", todo.completed)

      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date() : undefined;

      if (todo.completed && todo.subTasks?.length) {
        todo.subTasks.forEach((subTask) => {
          subTask.completed = true;
          subTask.completedAt = new Date();
        });
      }

      const parentTodo = findParentTodoById(id);
      if (
        parentTodo &&
        parentTodo.subTasks?.every((subTask) => subTask.completed)
      ) {
        parentTodo.completed = true;
        parentTodo.completedAt = new Date();
      }
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
    if (todo) {
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
