import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { TodoState } from "../../../index";
import { useGlobalStore } from "../../store/GlobalStore.ts";
import { useTodoStore } from "../../store/TodoStore.ts";
import useDebounce from "../../hook/useDebounce.ts";
import useTodoDelete from "../../hook/todo/useTodoDelete.ts";
import useTodoUpdate from "../../hook/todo/useTodoUpdate.ts";

export default function TodoDetail() {
  const { todoUpdate } = useTodoUpdate();
  const { todoDelete } = useTodoDelete();
  const { todoState, setTodoState, todoListState, setTodoListState } =
    useTodoStore();
  const { globalState, setGlobalState } = useGlobalStore();

  const startDate = new Date(todoState.startDate);
  const endDate = new Date(todoState.endDate);

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
      <div className="fixed inset-0 h-full w-full bg-customDark_3 opacity-70"></div>
      <div className="todo-detail-modal z-10 rounded bg-customDark_6 px-6 py-4">
        <ul className="flex w-full flex-col gap-y-2">
          {/* title */}
          <li className="mb-2 flex">
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
                className="w-64 bg-customDark_6 outline-none"
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

            <div className="flex gap-x-2">
              {/* done check */}
              <button
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
              </button>
              {/* delete */}
              <button
                onClick={() => {
                  if (todoState.id) todoDelete({ id: todoState.id });
                }}
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#EBEBEB"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </li>

          {/* description */}
          <li className="mb-2">
            {updateState.description ? (
              <div className="min-h-16">
                <input
                  defaultValue={todoState.description ?? ""}
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
                  className="flex w-64 items-start justify-start bg-customDark_6 align-top outline-none"
                  autoFocus
                />
              </div>
            ) : (
              <button
                onClick={() => toggleUpdateState(updateOption.description)}
                className="flex min-h-16 w-40"
              >
                {todoState.description ?? "내용"}
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

          <li className="flex justify-end gap-x-2"></li>
        </ul>
      </div>
    </div>
  );
}
