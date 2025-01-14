import { useEffect, useState } from "react";
import { TodoState } from "../..";
import { useGlobalStore } from "../GlobalStore";
import useFetchTodoAll from "../hook/useFetchTodoAll";
import useFetchTodoDone from "../hook/useFetchTodoDone";
import useFetchTodoInProgress from "../hook/useFetchTodoInProgress";
import useTimeFormat from "../hook/useTimeFormat";
import useTodoDelete from "../hook/useTodoDelete";
import useTodoUpdate from "../hook/useTodoUpdate";
import { FIND_OPTIONS, FindOption, useTodoStore } from "../TodoStore";
import Loading from "./Loading";

interface Props {
  todoList: TodoState[];
}

export default function TodoList(props: Readonly<Props>) {
  const { fetchTodoAll } = useFetchTodoAll();
  const { fetchTodoInProgress } = useFetchTodoInProgress();
  const { fetchTodoDone } = useFetchTodoDone();
  const { todoUpdate } = useTodoUpdate();
  const { todoDelete } = useTodoDelete();
  const { timeFormatMMDD } = useTimeFormat();

  const { findOption, setTodoState, todoListState } = useTodoStore();
  const { globalState, setGlobalState } = useGlobalStore();

  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [focusId, setFocusId] = useState<number>();

  useEffect(() => {
    if (props.todoList.length > 0) {
      const lastTodoElement = document.getElementById(
        `${props.todoList[props.todoList.length - 1].id}`,
      );
      if (lastTodoElement) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (
              entries[0].isIntersecting &&
              todoListState.totalPage > todoListState.currentPage
            ) {
              const fetchMap: Record<
                FindOption,
                (props: { page: number }) => Promise<void>
              > = {
                [FIND_OPTIONS.ALL]: fetchTodoAll,
                [FIND_OPTIONS.IN_PROGRESS]: fetchTodoInProgress,
                [FIND_OPTIONS.DONE]: fetchTodoDone,
              };
              const fetchFunction = fetchMap[findOption];

              setGlobalState({ loading: true });
              fetchFunction({ page: todoListState.currentPage + 1 });
            }
          },
          {
            root: null,
            rootMargin: "0px",
            threshold: 0.3,
          },
        );

        observer.observe(lastTodoElement);

        return () => {
          observer.unobserve(lastTodoElement);
        };
      }
    }
  }, [todoListState]);

  return (
    <div
      style={{ maxHeight: "calc(100vh - 180px)" }}
      className="custom-scrollbar relative h-full overflow-y-auto"
    >
      {props.todoList.map((todo: TodoState) => (
        <div
          key={todo.id}
          id={`${todo.id}`}
          onMouseEnter={() => {
            setIsFocus(true);
            setFocusId(todo.id);
          }}
          onMouseLeave={() => {
            setIsFocus(false);
          }}
          className="mb-2 flex w-full gap-x-3 rounded border border-customDark_6 px-2 py-4"
        >
          {/* done check */}
          <button
            className={`relative flex h-6 w-6 flex-shrink-0 cursor-pointer items-center rounded ${todo.isDone ? "bg-green-600" : "bg-white"}`}
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
          {/* detail */}
          <button
            onClick={() => {
              setTodoState(todo);
              setGlobalState({ detail: true, initialRender: true });
            }}
            className="w-full cursor-pointer truncate"
          >
            <div>{todo.id}</div>
            <div className="truncate text-start">{todo.title}</div>

            <div className="truncate text-start text-xs text-customGray_4">
              {todo.description}
            </div>
            <div className="text-start text-xs">
              {todo.startDate ? timeFormatMMDD({ time: todo.startDate }) : null}{" "}
              ~ {todo.endDate ? timeFormatMMDD({ time: todo.endDate }) : null}
            </div>
          </button>

          {/* delete */}
          <button
            onClick={() => {
              if (focusId) todoDelete({ id: focusId });
            }}
            className={`flex ${isFocus && todo.id === focusId ? "" : "hidden"}`}
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
      ))}
      {globalState.loading ? <Loading /> : null}
    </div>
  );
}
