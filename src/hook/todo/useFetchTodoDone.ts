import axios from "axios";
import { useEnvStore } from "../../store/EnvStore.ts";
import { useGlobalStore } from "../../store/GlobalStore.ts";
import { useTodoStore } from "../../store/TodoStore.ts";
import { TodoState } from "../../../index";
import { useTokenStore } from "../../store/TokenStore.tsx";

interface Props {
  page: number;
}

export default function useFetchTodoDone() {
  const { todoListState, setTodoListState } = useTodoStore();
  const { tokenState } = useTokenStore();
  const { setGlobalState } = useGlobalStore();

  const { envState } = useEnvStore();

  const fetchTodoDone = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;
    if (tokenState.accessToken) {
      try {
        const response = await axios.get(`${todoUrl}/done?page=${props.page}`);

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
      }
      setGlobalState({ loading: false });
    }
  };

  return { fetchTodoDone };
}
