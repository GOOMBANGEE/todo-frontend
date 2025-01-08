import { TodoState } from "../..";
import useTimeFormat from "../hook/useTimeFormat";
import useTodoUpdate from "../hook/useTodoUpdate";

interface Props {
  todoList: TodoState[];
}

export default function TodoList(props: Readonly<Props>) {
  const { todoUpdate } = useTodoUpdate();
  const { timeFormat } = useTimeFormat();

  return (
    <>
      {props.todoList.map((todo: TodoState) => (
        <div
          key={todo.id}
          className="border-customDark_6 mb-2 flex w-full gap-x-3 rounded border px-2 py-4"
        >
          <button
            className={`relative flex h-6 w-6 cursor-pointer items-center rounded ${todo.isDone ? "bg-green-600" : "bg-white"}`}
            onClick={() => {
              todoUpdate({
                todo: {
                  ...todo,
                  isDone: !todo.isDone,
                },
              });
            }}
          >
            <span
              className={`absolute left-1.5 text-white ${todo.isDone ? "block" : "hidden"}`}
            >
              &#10003;
            </span>
          </button>
          <button className="truncate">
            <div className="truncate text-start">{todo.title}</div>

            <div className="text-customGray_4 truncate text-start text-xs">
              {todo.description}
            </div>
            <div className="text-start text-xs">
              {todo.startDate ? timeFormat({ time: todo.startDate }) : null} ~
              {todo.endDate ? timeFormat({ time: todo.endDate }) : null}
            </div>
          </button>
        </div>
      ))}
    </>
  );
}
