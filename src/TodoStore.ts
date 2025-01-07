import { create } from "zustand";
import { TodoState } from "..";

interface TodoStore {
  findOption: FindOption;
  setFindOption: (state: FindOption) => void;
  todoState: TodoState;
  setTodoState: (state: Partial<TodoState>) => void;
  resetTodoState: () => void;
  todoListState: TodoListState;
  setTodoListState: (state: TodoListState) => void;
}

export const FIND_OPTIONS = {
  ALL: "all",
  IN_PROGRESS: "inProgress",
  DONE: "done",
} as const;
export type FindOption = (typeof FIND_OPTIONS)[keyof typeof FIND_OPTIONS];

const initialTodoState: TodoState = {
  id: undefined,
  title: undefined,
  description: undefined,
  isDone: undefined,
  startDate: undefined,
  endDate: undefined,
};

interface TodoListState {
  todoList: TodoState[];
  total: number;
  currentPage: number;
  totalPage: number;
}

const initialTodoListState: TodoListState = {
  todoList: [],
  total: 0,
  currentPage: 0,
  totalPage: 0,
};

export const useTodoStore = create<TodoStore>((set) => ({
  findOption: FIND_OPTIONS.ALL,
  setFindOption: (state) => set({ findOption: state }),
  todoState: initialTodoState,
  setTodoState: (state) =>
    set((prev) => ({ todoState: { ...prev.todoState, ...state } })),
  resetTodoState: () => set({ todoState: initialTodoState }),
  todoListState: initialTodoListState,
  setTodoListState: (state) =>
    set((prev) => ({ todoListState: { ...prev.todoListState, ...state } })),
}));
