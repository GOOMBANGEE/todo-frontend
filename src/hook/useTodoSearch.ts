import axios from "axios";
import { TodoState } from "../..";
import { useEnvStore } from "../EnvStore";
import { useGlobalStore } from "../GlobalStore";
import { useTodoStore } from "../TodoStore";

interface Props {
  keyword: string;
  page: number;
}

export default function useTodoSearch() {
  const { findOption, todoSearchListState, setTodoSearchListState } =
    useTodoStore();
  const { setGlobalState } = useGlobalStore();
  const { envState } = useEnvStore();

  const todoSearch = async (props: Readonly<Props>) => {
    try {
      const todoUrl = envState.todoUrl;

      const data = {
        keyword: props.keyword,
        option: findOption,
      };

      const response = await axios.post(
        `${todoUrl}/search?page=${props.page}`,
        data,
      );
      if (props.page === 1) {
        setTodoSearchListState(response.data);
      } else {
        const newTodoList: TodoState[] = [
          ...todoSearchListState.todoList,
          ...response.data.todoList,
        ];

        setTodoSearchListState({
          ...response.data,
          todoList: newTodoList,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGlobalState({ loading: false });
    }
  };
  return { todoSearch };
}
