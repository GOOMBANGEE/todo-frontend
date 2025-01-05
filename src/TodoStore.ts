import { create } from "zustand";
import { TodoState } from "..";

interface TodoStore {
  todoState: TodoState;
  setTodoState: (state: Partial<TodoState>) => void;
  todoListState: TodoListState;
  setTodoListState: (state: TodoListState) => void;
}

interface TodoListState {
  todoList: TodoState[];
  total: number;
  currentPage: number;
  totalPage: number;
}

const initialTodoState: TodoState = {
  id: undefined,
  title: undefined,
  description: undefined,
  isDone: undefined,
  startDate: undefined,
  endDate: undefined,
};

const initialTodoListState: TodoListState = {
  todoList: [],
  total: 0,
  currentPage: 0,
  totalPage: 0,
};

export const useTodoStore = create<TodoStore>((set) => ({
  todoState: initialTodoState,
  setTodoState: (state) =>
    set((prev) => ({ todoState: { ...prev.todoState, ...state } })),

  todoListState: initialTodoListState,
  setTodoListState: (state) =>
    set((prev) => ({ todoListState: { ...prev.todoListState, ...state } })),
}));
