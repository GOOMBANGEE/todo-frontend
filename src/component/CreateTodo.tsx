import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTodoCreate from "../hook/useTodoCreate";
import { useTodoStore } from "../TodoStore";

export default function CreateTodo() {
  const { todoCreate } = useTodoCreate();
  const { todoState, setTodoState, resetTodoState } = useTodoStore();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const startDate = todoState.startDate
    ? new Date(todoState.startDate)
    : new Date();
  const endDate = todoState.endDate ? new Date(todoState.endDate) : undefined;

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

  return (
    <>
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
            onChange={(date: Date | null) => {
              setTodoState({
                startDate: date ? date.toISOString() : undefined,
              });
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
          />
          <DatePicker
            className="bg-customDark_3 text-customText"
            selected={endDate}
            onChange={(date: Date | null) => {
              setTodoState({
                endDate: date ? date.toISOString() : undefined,
              });
            }}
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
    </>
  );
}
