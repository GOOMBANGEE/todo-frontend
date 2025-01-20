import axios from "axios";
import { TodoState } from "../../../index";
import { useEnvStore } from "../../store/EnvStore.ts";
import { useGlobalStore } from "../../store/GlobalStore.ts";
import { useTodoStore } from "../../store/TodoStore.ts";
import { useTokenStore } from "../../store/TokenStore.tsx";

interface Props {
  page: number;
}

export default function useFetchTodoAll() {
  const { todoListState, setTodoListState } = useTodoStore();
  const { tokenState } = useTokenStore();
  const { setGlobalState } = useGlobalStore();
  const { envState } = useEnvStore();

  const fetchTodoAll = async (props: Readonly<Props>) => {
    if (tokenState.accessToken) {
      const todoUrl = envState.todoUrl;
      try {
        const response = await axios.get(`${todoUrl}?page=${props.page}`);

        if (props.page === 1) {
          setTodoListState(response.data);
        } else {
          const newTodoList: TodoState[] = [
            ...todoListState.todoList,
            ...response.data.todoList,
          ];

          setTodoListState({
            ...response.data,
            todoList: newTodoList,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setGlobalState({ loading: false });
      }
    } else {
      setGlobalState({ loading: false });
    }
  };

  return { fetchTodoAll };
}
