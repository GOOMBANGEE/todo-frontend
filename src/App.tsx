import { useEffect } from "react";
import FindOptionButton from "./component/todo/FindOptionButton.tsx";
import TodoCreate from "./component/todo/TodoCreate.tsx";
import TodoDetail from "./component/todo/TodoDetail.tsx";
import TodoList from "./component/todo/TodoList.tsx";
import { useGlobalStore } from "./store/GlobalStore.ts";
import useFetchTodoAll from "./hook/todo/useFetchTodoAll.ts";
import { FIND_OPTIONS, useTodoStore } from "./store/TodoStore.ts";
import LoginModal from "./component/user/LoginModal.tsx";
import useRefreshAccessToken from "./hook/useRefreshAccessToken.tsx";
import { useTokenStore } from "./store/TokenStore.tsx";
import AuthButton from "./component/user/AuthButton.tsx";
import RegisterModal from "./component/user/RegisterModal.tsx";
import TodoSearch from "./component/todo/TodoSearch.tsx";

export default function App() {
  const { refreshAccessToken } = useRefreshAccessToken();
  const { fetchTodoAll } = useFetchTodoAll();
  const { searchKeyword, todoListState, todoSearchListState } = useTodoStore();
  const { tokenState } = useTokenStore();
  const { setGlobalState } = useGlobalStore();

  useEffect(() => {
    refreshAccessToken();
  }, []);

  useEffect(() => {
    if (tokenState.accessToken) {
      setGlobalState({ loading: true });
      fetchTodoAll({ page: 1 });
    }
  }, [tokenState.accessToken]);

  return (
    <div className="relative mx-auto flex h-full w-1/3 justify-center py-8 text-customText">
      <div className="flex h-full w-full flex-col">
        <AuthButton />
        <LoginModal />
        <RegisterModal />

        <TodoCreate />

        <div className="mb-2 flex">
          <div className="flex gap-x-2">
            <FindOptionButton option={FIND_OPTIONS.ALL} />
            <FindOptionButton option={FIND_OPTIONS.IN_PROGRESS} />
            <FindOptionButton option={FIND_OPTIONS.DONE} />
          </div>
        </div>
        <TodoSearch />
        <div>
          {searchKeyword ? (
            <TodoList todoList={todoSearchListState.todoList} />
          ) : (
            <TodoList todoList={todoListState.todoList} />
          )}
        </div>

        <TodoDetail />
      </div>
    </div>
  );
}
