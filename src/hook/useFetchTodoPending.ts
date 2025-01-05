import axios from "axios";
import { useEnvStore } from "../EnvStore";
import { useTodoStore } from "../TodoStore";

interface Props {
  page: number;
}

export default function useFetchTodoPending() {
  const { setTodoListState } = useTodoStore();
  const { envState } = useEnvStore();

  const fetchTodoPending = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;
    try {
      const response = await axios.get(
        `${todoUrl}/pending?currentPage=${props.page}`,
      );
      setTodoListState(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return { fetchTodoPending };
}
