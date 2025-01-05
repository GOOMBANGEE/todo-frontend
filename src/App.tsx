import { useEffect, useState } from "react";
import { TodoState } from "..";
import useFetchTodoAll from "./hook/useFetchTodoAll";
import useFetchTodoDone from "./hook/useFetchTodoDone";
import useFetchTodoPending from "./hook/useFetchTodoPending";
import useTimeFormat from "./hook/useTimeFormat";
import useTodoUpdate from "./hook/useTodoUpdate";
import { useTodoStore } from "./TodoStore";

export default function App() {
  const { fetchTodoAll } = useFetchTodoAll();
  const { fetchTodoPending } = useFetchTodoPending();
  const { fetchTodoDone } = useFetchTodoDone();
  const { todoUpdate } = useTodoUpdate();
  const { timeFormat } = useTimeFormat();
  const { todoListState } = useTodoStore();

  const FIND_OPTIONS = {
    ALL: "all",
    PENDING: "pending",
    DONE: "done",
  };
  const [findOption, setFindOption] = useState<string>(FIND_OPTIONS.ALL);

  // render시 all fetch
  useEffect(() => {
    fetchTodoAll({ page: 1 });
  }, []);

  useEffect(() => {
    const fetchMap: Record<string, (props: { page: number }) => Promise<void>> =
      {
        all: fetchTodoAll,
        pending: fetchTodoPending,
        done: fetchTodoDone,
      };

    const fetchFunction = fetchMap[findOption];
    fetchFunction({ page: 1 });
  }, [findOption]);

  return (
    <div className="text-customText mx-auto flex w-1/3 justify-center py-8">
      <div className="flex w-full flex-col">
        <nav className="ml-auto"> nav login</nav>

        <button> todo add</button>

        <div className="mb-2 flex">
          <div className="flex gap-x-2">
            <button
              onClick={() => {
                setFindOption(FIND_OPTIONS.ALL);
              }}
              className={`rounded px-0.5 text-sm font-semibold ${findOption === FIND_OPTIONS.ALL ? "text-customText bg-green-600" : "text-customDark_3 bg-white"}`}
            >
              ALL
            </button>
            <button
              onClick={() => {
                setFindOption(FIND_OPTIONS.PENDING);
              }}
              className={`rounded px-0.5 text-sm font-semibold ${findOption === FIND_OPTIONS.PENDING ? "text-customText bg-green-600" : "text-customDark_3 bg-white"}`}
            >
              PENDING
            </button>
            <button
              onClick={() => {
                setFindOption(FIND_OPTIONS.DONE);
              }}
              className={`rounded px-0.5 text-sm font-semibold ${findOption === FIND_OPTIONS.DONE ? "text-customText bg-green-600" : "text-customDark_3 bg-white"}`}
            >
              DONE
            </button>
          </div>
          <div className="ml-auto"> search</div>
        </div>
        <div>
          {todoListState.todoList.map((todo: TodoState) => (
            <div
              key={todo.id}
              className="mb-1 flex w-full gap-x-3 rounded border border-gray-300 px-2 py-4"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  onChange={() => {
                    todoUpdate({
                      todo: {
                        ...todo,
                        isDone: !todo.isDone,
                      },
                    });
                  }}
                  checked={todo.isDone}
                  className="peer h-6 w-6 appearance-none rounded bg-white checked:bg-green-600"
                />
                <span className="absolute left-1.5 hidden text-white peer-checked:inline-block">
                  &#10003;
                </span>
              </div>
              <button className="truncate">
                <div className="truncate text-start">{todo.title}</div>

                <div className="truncate text-start text-xs">
                  {todo.description}
                </div>
                <div className="text-start text-xs">
                  {todo.startDate ? timeFormat({ time: todo.startDate }) : null}{" "}
                  ~ {todo.endDate ? timeFormat({ time: todo.endDate }) : null}
                </div>
              </button>
            </div>
          ))}
        </div>

        <div>fix + button</div>
        <div>hidden modal</div>
      </div>
    </div>
  );
}
