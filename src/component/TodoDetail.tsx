import { useEffect } from "react";
import { useGlobalStore } from "../GlobalStore";
import { useTodoStore } from "../TodoStore";
import useTimeFormat from "../hook/useTimeFormat";
import useTodoUpdate from "../hook/useTodoUpdate";

export default function TodoDetail() {
  const { todoUpdate } = useTodoUpdate();
  const { timeFormatYYMMDD } = useTimeFormat();
  const { todoState, setTodoState, resetTodoState } = useTodoStore();
  const { globalState, setGlobalState } = useGlobalStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        globalState.detail &&
        !(e.target as HTMLElement).closest(".todo-detail-modal")
      ) {
        setGlobalState({ detail: false });
        resetTodoState();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [globalState, setGlobalState]);

  // todo check시 todo update 실행
  // todo 삭제버튼 우상단
  return (
    <div
      className={`fixed inset-0 flex h-full w-full items-center justify-center ${globalState.detail ? "" : "hidden"}`}
    >
      <div className="bg-customDark_3 fixed inset-0 h-full w-full opacity-70"></div>
      <div className="todo-detail-modal bg-customDark_6 z-10 rounded px-6 py-4">
        <ul className="flex flex-col gap-y-2">
          <li className="mb-2">
            <div>{todoState.title}</div>
          </li>
          <li className="mb-2">
            {todoState.description ? todoState.description : "내용"}
          </li>
          <li className="text-sm">
            시작일:{" "}
            {todoState.startDate
              ? timeFormatYYMMDD({ time: todoState.startDate })
              : ""}
          </li>
          <li className="text-sm">
            종료일:{" "}
            {todoState.endDate
              ? timeFormatYYMMDD({ time: todoState.endDate })
              : ""}
          </li>

          <li className="flex justify-end gap-x-2">
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
            <button className="아무것도 바뀐게없다면 활성화x text-customDark_5 rounded bg-green-500 px-2 text-sm">
              저장
            </button>
            <button className="아무것도 바뀐게없다면 활성화x text-customDark_5 rounded bg-white px-2 text-sm">
              닫기
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
