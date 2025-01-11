import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { TodoState } from "../..";
import { useGlobalStore } from "../GlobalStore";
import { useTodoStore } from "../TodoStore";
import useDebounce from "../hook/useDebounce";
import useTodoUpdate from "../hook/useTodoUpdate";

export default function TodoDetail() {
  const { todoUpdate } = useTodoUpdate();
  const { todoState, setTodoState, todoListState, setTodoListState } =
    useTodoStore();
  const { globalState, setGlobalState } = useGlobalStore();

  const startDate = new Date(todoState.startDate);
  const endDate = new Date(todoState.endDate);

  // todo check ,delete 우상단

  // update state
  const updateOption = {
    title: "title",
    description: "description",
    startDate: "startDate",
    endDate: "endDate",
  } as const;
  type UpdateOptionType = Record<keyof typeof updateOption, boolean>;

  const [updateState, setUpdateState] = useState<UpdateOptionType>({
    title: false,
    description: false,
    startDate: false,
    endDate: false,
  });

  const toggleUpdateState = (key: keyof typeof updateOption) => {
    setUpdateState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // send update api
  const todoRef = useRef<TodoState>();
  useEffect(() => {
    if (globalState.initialRender) todoRef.current = todoState;
  }, [globalState.initialRender]);

  const debounceTitle = useDebounce(todoState.title, 2200);
  const debounceDescription = useDebounce(todoState.description, 2200);

  useEffect(() => {
    if (todoState.id && todoRef.current !== todoState) {
      todoUpdate({
        todo: { ...todoState, title: todoState.title },
      });
    }
  }, [debounceTitle]);
  useEffect(() => {
    if (todoState.id && todoRef.current !== todoState) {
      todoUpdate({
        todo: { ...todoState, description: todoState.description },
      });
    }
  }, [debounceDescription]);

  // click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        globalState.detail &&
        !(e.target as HTMLElement).closest(".todo-detail-modal")
      ) {
        setGlobalState({ detail: false, initialRender: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [globalState, setGlobalState]);

  return (
    <div
      className={`fixed inset-0 flex h-full w-full items-center justify-center ${globalState.detail ? "" : "hidden"}`}
    >
      <div className="bg-customDark_3 fixed inset-0 h-full w-full opacity-70"></div>
      <div className="todo-detail-modal bg-customDark_6 z-10 rounded px-6 py-4">
        <ul className="flex w-full flex-col gap-y-2">
          {/* title */}
          <li className="mb-2">
            {updateState.title ? (
              <input
                defaultValue={todoState.title}
                onChange={(e) => {
                  setTodoListState({
                    ...todoListState,
                    todoList: todoListState.todoList.map((todo) => {
                      if (todo.id === todoState.id) {
                        return { ...todo, title: e.target.value };
                      } else {
                        return todo;
                      }
                    }),
                  });
                  setTodoState({ ...todoState, title: e.target.value });
                }}
                onBlur={() => toggleUpdateState(updateOption.title)}
                className="bg-customDark_6 w-64 outline-none"
                autoFocus
              />
            ) : (
              <button
                onClick={() => toggleUpdateState(updateOption.title)}
                className="w-64 text-start"
              >
                {todoState.title}
              </button>
            )}
          </li>
          {/* description */}
          <li className="mb-2">
            {updateState.description ? (
              <div className="min-h-16">
                <input
                  defaultValue={todoState.description || ""}
                  onChange={(e) => {
                    setTodoListState({
                      ...todoListState,
                      todoList: todoListState.todoList.map((todo) => {
                        if (todo.id === todoState.id) {
                          return { ...todo, description: e.target.value };
                        } else {
                          return todo;
                        }
                      }),
                    });
                    setTodoState({ description: e.target.value });
                  }}
                  onBlur={() => toggleUpdateState(updateOption.description)}
                  className="bg-customDark_6 flex w-64 items-start justify-start align-top outline-none"
                  autoFocus
                />
              </div>
            ) : (
              <button
                onClick={() => toggleUpdateState(updateOption.description)}
                className="flex min-h-16 w-40"
              >
                {todoState.description || "내용"}
              </button>
            )}
          </li>
          {/* startDate */}
          <li className="text-sm">
            <div>
              시작일:{" "}
              <DatePicker
                className="bg-customDark_6 text-customText"
                selected={startDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    todoUpdate({
                      todo: {
                        ...todoState,
                        startDate: date.toISOString(),
                      },
                    });
                  }
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </li>
          {/* endDate */}
          <li className="text-sm">
            <div>
              종료일:{" "}
              <DatePicker
                className="bg-customDark_6 text-customText"
                selected={endDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    todoUpdate({
                      todo: {
                        ...todoState,
                        endDate: date.toISOString(),
                      },
                    });
                  }
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate} // 시작 날짜 이후로만 선택 가능
                dateFormat="yyyy-MM-dd"
                placeholderText="Select end date"
              />
            </div>
          </li>

          {/* done check */}
          {/* <button
              className={`relative flex h-6 w-6 flex-shrink-0 cursor-pointer items-center rounded ${todoState.isDone ? "bg-green-600" : "bg-white"}`}
              onClick={() => {
                todoUpdate({
                  todo: {
                    ...todoState,
                    isDone: !todoState.isDone,
                  },
                });
              }}
            >
              <span
                className={`absolute left-1.5 text-white ${todoState.isDone ? "block" : "hidden"}`}
              >
                &#10003;
              </span>
            </button> */}
          <li className="flex justify-end gap-x-2"></li>
        </ul>
      </div>
    </div>
  );
}
