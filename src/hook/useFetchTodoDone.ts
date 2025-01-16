import axios from "axios";
import { useEnvStore } from "../EnvStore";
import { useGlobalStore } from "../GlobalStore";
import { useTodoStore } from "../TodoStore";
import { TodoState } from "../../index";

interface Props {
  page: number;
}

export default function useFetchTodoDone() {
  const { todoListState, setTodoListState } = useTodoStore();
  const { setGlobalState } = useGlobalStore();
  const { envState } = useEnvStore();

  const fetchTodoDone = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;
    try {
      const response = await axios.get(
        `${todoUrl}/done?currentPage=${props.page}`,
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
    }
    setGlobalState({ loading: false });
  };

  return { fetchTodoDone };
}
