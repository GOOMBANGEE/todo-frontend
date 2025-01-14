import axios from "axios";
import { TodoState } from "../..";
import { useEnvStore } from "../EnvStore";
import { useGlobalStore } from "../GlobalStore";
import { useTodoStore } from "../TodoStore";

interface Props {
  page: number;
}

export default function useFetchTodoAll() {
  const { todoListState, setTodoListState } = useTodoStore();
  const { setGlobalState } = useGlobalStore();
  const { envState } = useEnvStore();

  const fetchTodoAll = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;

    try {
      const response = await axios.get(`${todoUrl}?currentPage=${props.page}`);

      const newTodoList: TodoState[] = [
        ...todoListState.todoList,
        ...response.data.todoList,
      ];

      setTodoListState({
        ...response.data,
        todoList: newTodoList,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setGlobalState({ loading: false });
    }
  };

  return { fetchTodoAll };
}
