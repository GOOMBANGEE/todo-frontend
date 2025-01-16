import axios from "axios";
import { TodoListState } from "../..";
import { useEnvStore } from "../EnvStore";
import { useGlobalStore } from "../GlobalStore";
import { useTodoStore } from "../TodoStore";

interface Props {
  keyword: string;
  currentPage?: number;
}

export default function useTodoSearch() {
  const { setTodoSearchListState } = useTodoStore();
  const { setGlobalState } = useGlobalStore();
  const { envState } = useEnvStore();

  const todoSearch = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;

    const data = {
      keyword: props.keyword,
      currentPage: props.currentPage ?? 1,
    };
    const response = await axios.post(`${todoUrl}/search`, data);

    const todoListState: TodoListState = response.data;
    setTodoSearchListState(todoListState);
    setGlobalState({ loading: false });
  };
  return { todoSearch };
}
