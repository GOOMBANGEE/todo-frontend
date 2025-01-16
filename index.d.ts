export interface TodoState {
  id: number | undefined;
  title: string | undefined;
  description: string | undefined;
  isDone: boolean | undefined;
  startDate: string;
  endDate: string;
}

export interface TodoListState {
  todoList: TodoState[];
  total: number;
  page: number;
  totalPage: number;
}
