import { FormEvent, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTodoCreate from "../../hook/todo/useTodoCreate.ts";
import { useTodoStore } from "../../store/TodoStore.ts";
import { useTokenStore } from "../../store/TokenStore.tsx";
import useRegister from "../../hook/user/useRegister.ts";
import useRefreshAccessToken from "../../hook/useRefreshAccessToken.tsx";
import ErrorMessage from "../ErrorMessage.tsx";

export default function TodoCreate() {
  const { todoCreate } = useTodoCreate();
  const { register } = useRegister();
  const { refreshAccessToken } = useRefreshAccessToken();

  const { todoState, setTodoState, resetTodoState } = useTodoStore();
  const { tokenState } = useTokenStore();

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [anonymousRegister, setAnonymousRegister] = useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = useState<string>();
  const titleRef = useRef<HTMLInputElement>(null);

  const startDate = new Date(todoState.startDate);
  const endDate = new Date(todoState.endDate);

  // modal open
  const handleClickModalOpen = () => {
    setCreateModalOpen(true);
    setTodoState({
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    });
  };

  // modal open focus
  useEffect(() => {
    if (createModalOpen) titleRef.current?.focus();
  }, [createModalOpen]);

  // todo create
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!todoState.title) {
      setTitleErrorMessage("제목이 비어있습니다");
      return;
    }

    if (tokenState.accessToken) {
      todoCreate();
      setCreateModalOpen(false);
    } else if (await register({ username: "anonymous" })) {
      // 비회원인 경우 익명회원가입 절차 후 create 실행
      refreshAccessToken();
      setAnonymousRegister(true);
    }
  };

  // 비회원인 경우 익명회원가입 절차 후 create 실행
  useEffect(() => {
    if (anonymousRegister && tokenState.accessToken) {
      todoCreate();
      setCreateModalOpen(false);
      setAnonymousRegister(false);
    }
  }, [anonymousRegister, tokenState.accessToken]);

  // click outside
  useEffect(() => {
    resetTodoState();
    const handleClickOutside = (e: MouseEvent) => {
      if (
        createModalOpen &&
        !(e.target as HTMLElement).closest(".todo-create-modal")
      ) {
        setCreateModalOpen(false);
        setTitleErrorMessage(undefined);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [createModalOpen, setCreateModalOpen]);

  return (
    <>
      {createModalOpen ? (
        <div className="todo-create-modal mb-4 flex flex-col rounded border border-customDark_6 px-2 py-2 text-start">
          <form onSubmit={(e) => handleSubmit(e)}>
            {/* title */}
            <input
              ref={titleRef}
              onChange={(e) => {
                setTodoState({ title: e.target.value });
                setTitleErrorMessage(undefined);
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

            {/* startDate */}
            <DatePicker
              className="bg-customDark_3 text-customText"
              selected={startDate}
              onChange={(date: Date | null) => {
                setTodoState({
                  startDate: date
                    ? date.toISOString()
                    : new Date().toISOString(),
                });
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="YYYY-MM-DD"
            />

            {/* endDate */}
            <DatePicker
              className="bg-customDark_3 text-customText"
              selected={endDate}
              onChange={(date: Date | null) => {
                setTodoState({
                  endDate: date ? date.toISOString() : new Date().toISOString(),
                });
              }}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate} // 시작 날짜 이후로만 선택 가능
              dateFormat="YYYY-MM-DD"
              placeholderText="Select end date"
            />

            {/* error message */}
            <ErrorMessage message={titleErrorMessage} />

            {/* save, cancel button */}
            <div className="flex justify-end gap-x-2">
              <button type={"submit"}>Save</button>
              <button
                type={"reset"}
                onClick={() => {
                  setCreateModalOpen(false);
                  resetTodoState();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={handleClickModalOpen}
          className={`mb-4 cursor-text rounded border border-customDark_6 px-2 py-2 text-start`}
        >
          create todo...
        </button>
      )}
    </>
  );
}
