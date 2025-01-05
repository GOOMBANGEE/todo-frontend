import axios from "axios";
import { TodoState } from "../..";
import { useEnvStore } from "../EnvStore";

interface Props {
  todo: TodoState;
}

export default function useTodoUpdate() {
  const { envState } = useEnvStore();

  const todoUpdate = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;

    const response = await axios.patch(`${todoUrl}/${props.todo.id}`, {
      title: props.todo.title,
      description: props.todo.description,
      isDone: props.todo.isDone,
      startDate: props.todo.startDate,
      endDate: props.todo.endDate,
    });
    console.log(response);
  };

  return { todoUpdate };
}
