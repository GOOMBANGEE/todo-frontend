import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TodoState } from "..";
import useFetchTodoAll from "./hook/useFetchTodoAll";
import useFetchTodoDone from "./hook/useFetchTodoDone";
import useFetchTodoInProgress from "./hook/useFetchTodoInProgress";
import useTimeFormat from "./hook/useTimeFormat";
import useTodoCreate from "./hook/useTodoCreate";
import useTodoUpdate from "./hook/useTodoUpdate";
import { FIND_OPTIONS, useTodoStore } from "./TodoStore";

export default function App() {
  const { fetchTodoAll } = useFetchTodoAll();
  const { fetchTodoInProgress } = useFetchTodoInProgress();
  const { fetchTodoDone } = useFetchTodoDone();
  const { todoUpdate } = useTodoUpdate();
  const { timeFormat } = useTimeFormat();
  const { todoCreate } = useTodoCreate();
  const {
    findOption,
    setFindOption,
    todoState,
    setTodoState,
    resetTodoState,
    todoListState,
  } = useTodoStore();

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const handleClickOutside = (e: MouseEvent) => {
    if (
      createModalOpen &&
      !(e.target as HTMLElement).closest(".todo-add-modal")
    ) {
      setCreateModalOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [createModalOpen, setCreateModalOpen]);
  // render시 all fetch
  useEffect(() => {
    console.log(createModalOpen);
  }, [createModalOpen]);

  useEffect(() => {
    fetchTodoAll({ page: 1 });
  }, []);

  useEffect(() => {
    const fetchMap: Record<string, (props: { page: number }) => Promise<void>> =
      {
        all: fetchTodoAll,
        inProgress: fetchTodoInProgress,
        done: fetchTodoDone,
      };

    const fetchFunction = fetchMap[findOption];
    fetchFunction({ page: 1 });
  }, [findOption]);

  // 시작 날짜 변경 핸들러
  const handleStartDateChange = (date: Date | null) => {
    setTodoState({ startDate: date ? date.toISOString() : undefined });
  };

  // 끝나는 날짜 변경 핸들러
  const handleEndDateChange = (date: Date | null) => {
    setTodoState({ endDate: date ? date.toISOString() : undefined });
  };

  const startDate = todoState.startDate
    ? new Date(todoState.startDate)
    : new Date();
  const endDate = todoState.endDate ? new Date(todoState.endDate) : undefined;

  // useEffect(() => {
  //   console.log("====================");
  //   console.log("title : ", todoState.title);
  //   console.log("description : ", todoState.description);
  //   console.log("startDate : ", todoState.startDate);
  //   console.log("endDate : ", todoState.endDate);
  // }, [todoState]);

  return (
    <div className="text-customText relative mx-auto flex w-1/3 justify-center py-8">
      <div className="flex w-full flex-col">
        <nav className="ml-auto"> nav login</nav>
        {createModalOpen ? (
          <div className="border-customDark_6 todo-add-modal mb-4 flex flex-col rounded border px-2 py-2 text-start">
            // todo
            {/* // create todo click -> focus hidden modal todo title */}
            {/* title */}
            <input
              onChange={(e) => {
                setTodoState({ title: e.target.value });
              }}
              placeholder="title"
              className="bg-customDark_3 text-customText"
            />
            {/* description */}
            <input
              onChange={(e) => {
                setTodoState({ description: e.target.value });
              }}
              placeholder="description"
              className="bg-customDark_3 text-customText"
            />
            <DatePicker
              className="bg-customDark_3 text-customText"
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
            />
            <DatePicker
              className="bg-customDark_3 text-customText"
              selected={startDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate} // 시작 날짜 이후로만 선택 가능
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
            />
            <div className="flex justify-end gap-x-2">
              <button
                onClick={() => {
                  todoCreate();
                  setCreateModalOpen(false);
                  resetTodoState();
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setCreateModalOpen(false);
                  resetTodoState();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setCreateModalOpen(true);
              setTodoState({
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
              });
            }}
            className={`border-customDark_6 mb-4 cursor-text rounded border px-2 py-2 text-start`}
          >
            create todo...
          </button>
        )}

        <div className="mb-2 flex">
          <div className="flex gap-x-2">
            <button
              onClick={() => {
                setFindOption(FIND_OPTIONS.ALL);
              }}
              className={`rounded px-1 text-sm font-semibold ${findOption === FIND_OPTIONS.ALL ? "text-customText bg-green-600" : "text-customDark_3 bg-white"}`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFindOption(FIND_OPTIONS.IN_PROGRESS);
              }}
              className={`rounded px-1 text-sm font-semibold ${findOption === FIND_OPTIONS.IN_PROGRESS ? "text-customText bg-green-600" : "text-customDark_3 bg-white"}`}
            >
              In progress
            </button>
            <button
              onClick={() => {
                setFindOption(FIND_OPTIONS.DONE);
              }}
              className={`rounded px-1 text-sm font-semibold ${findOption === FIND_OPTIONS.DONE ? "text-customText bg-green-600" : "text-customDark_3 bg-white"}`}
            >
              Done
            </button>
          </div>
          <div className="ml-auto"> search</div>
        </div>
        <div>
          {todoListState.todoList.map((todo: TodoState) => (
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
                  {todo.startDate ? timeFormat({ time: todo.startDate }) : null}{" "}
                  ~ {todo.endDate ? timeFormat({ time: todo.endDate }) : null}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
