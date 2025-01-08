import axios from "axios";
import { TodoState } from "../..";
import { useEnvStore } from "../EnvStore";
import { useTodoStore } from "../TodoStore";

interface Props {
  id: number;
}

export default function useTodoDelete() {
  const { todoListState, setTodoListState } = useTodoStore();
  const { envState } = useEnvStore();

  const todoDelete = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;
    await axios.delete(`${todoUrl}/${props.id}`);

    const newTodoList: TodoState[] = todoListState.todoList.filter(
      (todo) => todo.id !== props.id,
    );

    setTodoListState({ ...todoListState, todoList: newTodoList });
  };

  return { todoDelete };
}
