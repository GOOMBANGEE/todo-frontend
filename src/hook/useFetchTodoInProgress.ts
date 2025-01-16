import axios from "axios";
import { TodoState } from "../..";
import { useEnvStore } from "../EnvStore";
import { useGlobalStore } from "../GlobalStore";
import { useTodoStore } from "../TodoStore";

interface Props {
  page: number;
}

export default function useFetchTodoInProgress() {
  const { todoListState, setTodoListState } = useTodoStore();
  const { setGlobalState } = useGlobalStore();
  const { envState } = useEnvStore();

  const fetchTodoInProgress = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;
    try {
      const response = await axios.get(
        `${todoUrl}/in-progress?page=${props.page}`,
      );

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
  };

  return { fetchTodoInProgress };
}
