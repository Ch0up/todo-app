export interface Todo {
  id: number;
  name: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  subTasks?: Todo[];
}
