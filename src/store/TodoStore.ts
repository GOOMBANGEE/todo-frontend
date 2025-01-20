import { create } from "zustand";
import { TodoListState, TodoState } from "../../index";

interface TodoStore {
  findOption: FindOption;
  setFindOption: (state: FindOption) => void;
  searchKeyword: string;
  setSearchKeyword: (state: string) => void;
  todoState: TodoState;
  setTodoState: (state: Partial<TodoState>) => void;
  resetTodoState: () => void;
  todoListState: TodoListState;
  setTodoListState: (state: TodoListState) => void;
  todoSearchListState: TodoListState;
  setTodoSearchListState: (state: TodoListState) => void;
}

export const FIND_OPTIONS = {
  ALL: "All",
  IN_PROGRESS: "In progress",
  DONE: "Done",
} as const;
export type FindOption = (typeof FIND_OPTIONS)[keyof typeof FIND_OPTIONS];

const initialTodoState: TodoState = {
  id: undefined,
  title: undefined,
  description: undefined,
  isDone: undefined,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
};

const initialTodoListState: TodoListState = {
  todoList: [],
  total: 0,
  page: 0,
  totalPage: 0,
};

export const useTodoStore = create<TodoStore>((set) => ({
  findOption: FIND_OPTIONS.ALL,
  setFindOption: (state) => set({ findOption: state }),

  searchKeyword: "",
  setSearchKeyword: (state) => set({ searchKeyword: state }),

  todoState: initialTodoState,
  setTodoState: (state) =>
    set((prev) => ({ todoState: { ...prev.todoState, ...state } })),
  resetTodoState: () => set({ todoState: initialTodoState }),

  todoListState: initialTodoListState,
  setTodoListState: (state) =>
    set((prev) => ({ todoListState: { ...prev.todoListState, ...state } })),

  todoSearchListState: initialTodoListState,
  setTodoSearchListState: (state) =>
    set((prev) => ({
      todoSearchListState: { ...prev.todoSearchListState, ...state },
    })),
}));
