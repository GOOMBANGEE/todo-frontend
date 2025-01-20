import axios from "axios";
import { TodoState } from "../../../index";
import { useEnvStore } from "../../store/EnvStore.ts";
import { useTodoStore } from "../../store/TodoStore.ts";

export default function useTodoCreate() {
  const { todoState, todoListState, setTodoListState, resetTodoState } =
    useTodoStore();
  const { envState } = useEnvStore();

  const todoCreate = async () => {
    const todoUrl = envState.todoUrl;
    const { ...request } = todoState;

    const response = await axios.post(`${todoUrl}`, { ...request });
    const todo: TodoState = response.data;

    const newTodoList: TodoState[] = [...todoListState.todoList, todo];
    setTodoListState({ ...todoListState, todoList: newTodoList });
    resetTodoState();
  };

  return { todoCreate };
}
