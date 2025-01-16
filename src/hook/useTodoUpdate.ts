import axios from "axios";
import { TodoState } from "../..";
import { useEnvStore } from "../EnvStore";
import { FIND_OPTIONS, useTodoStore } from "../TodoStore";

interface Props {
  todo: TodoState;
}

export default function useTodoUpdate() {
  const {
    findOption,
    searchKeyword,
    setTodoState,
    todoListState,
    setTodoListState,
    todoSearchListState,
    setTodoSearchListState,
  } = useTodoStore();
  const { envState } = useEnvStore();

  const updateState = (
    todoList: TodoState[],
    updateTodo: TodoState,
    allOption: boolean,
  ): TodoState[] =>
    allOption
      ? todoList.map((todo) => (todo.id === updateTodo.id ? updateTodo : todo))
      : (() => {
          const originalTodo = todoList.find(
            (todo) => todo.id === updateTodo.id,
          );
          return originalTodo && originalTodo.isDone === updateTodo.isDone
            ? todoList.map((todo) =>
                todo.id === updateTodo.id ? updateTodo : todo,
              )
            : todoList.filter((todo) => todo.id !== updateTodo.id);
        })();

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
    await axios.patch(`${todoUrl}/${id}`, { ...request });

    setTodoState(updateTodo);
    if (searchKeyword) {
      const updateList = updateState(
        todoSearchListState.todoList,
        updateTodo,
        findOption === FIND_OPTIONS.ALL,
      );
      setTodoSearchListState({ ...todoSearchListState, todoList: updateList });
    } else {
      const updateList = updateState(
        todoListState.todoList,
        updateTodo,
        findOption === FIND_OPTIONS.ALL,
      );
      setTodoListState({ ...todoListState, todoList: updateList });
    }
  };

  return { todoUpdate };
}
