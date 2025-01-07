export interface TodoState {
  id: number | undefined;
  title: string | undefined;
  description: string | undefined;
  isDone: boolean | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
}

export interface TodoListState {
  todoList: TodoState[];
  total: number;
  currentPage: number;
  totalPage: number;
}
