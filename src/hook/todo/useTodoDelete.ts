import axios from "axios";
import { TodoState } from "../../../index";
import { useEnvStore } from "../../store/EnvStore.ts";
import { useTodoStore } from "../../store/TodoStore.ts";

interface Props {
  id: number;
}

export default function useTodoDelete() {
  const {
    searchKeyword,
    todoListState,
    setTodoListState,
    todoSearchListState,
    setTodoSearchListState,
  } = useTodoStore();
  const { envState } = useEnvStore();

  const todoDelete = async (props: Readonly<Props>) => {
    const todoUrl = envState.todoUrl;
    await axios.delete(`${todoUrl}/${props.id}`);

    const filterTodoList = (todoList: TodoState[]): TodoState[] => {
      return todoList.filter((todo) => todo.id !== props.id);
    };

    if (searchKeyword) {
      const newTodoList = filterTodoList(todoSearchListState.todoList);
      setTodoSearchListState({ ...todoSearchListState, todoList: newTodoList });
    } else {
      const newTodoList = filterTodoList(todoListState.todoList);
      setTodoListState({ ...todoListState, todoList: newTodoList });
    }
  };

  return { todoDelete };
}
