import axios from "axios";
import { useEnvStore } from "../EnvStore";
import { useTodoStore } from "../TodoStore";

interface Props {
  page: number;
}

export default function useFetchTodoDone() {
  const { setTodoListState } = useTodoStore();
  const { envState } = useEnvStore();

  const fetchTodoDone = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;
    try {
      const response = await axios.get(
        `${todoUrl}/done?currentPage=${props.page}`,
      );
      setTodoListState(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return { fetchTodoDone };
}
