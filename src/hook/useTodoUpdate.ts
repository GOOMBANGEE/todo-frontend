import axios from "axios";
import { TodoState } from "../..";
import { useEnvStore } from "../EnvStore";
import { FIND_OPTIONS, useTodoStore } from "../TodoStore";

interface Props {
  todo: TodoState;
}

export default function useTodoUpdate() {
  const { findOption, todoListState, setTodoListState } = useTodoStore();
  const { envState } = useEnvStore();

  const todoUpdate = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;

    const updateTodo: TodoState = {
      id: props.todo.id,
      title: props.todo.title,
      description: props.todo.description,
      isDone: props.todo.isDone,
      startDate: props.todo.startDate,
      endDate: props.todo.endDate,
    };
    const { id, ...request } = updateTodo;
    await axios.patch(`${todoUrl}/${props.todo.id}`, { ...request });

    let newTodoList: TodoState[] = [];
    if (findOption !== FIND_OPTIONS.ALL) {
      newTodoList = todoListState.todoList.filter(
        (todo) => todo.id !== updateTodo.id,
      );
    } else {
      newTodoList = todoListState.todoList.map((todo) =>
        todo.id === updateTodo.id ? updateTodo : todo,
      );
    }

    setTodoListState({ ...todoListState, todoList: newTodoList });
  };

  return { todoUpdate };
}
