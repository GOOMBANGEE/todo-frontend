import { useEffect, useState } from "react";
import FindOptionButton from "./component/FindOptionButton";
import TodoCreate from "./component/TodoCreate";
import TodoDetail from "./component/TodoDetail";
import TodoList from "./component/TodoList";
import { useGlobalStore } from "./GlobalStore";
import useDebounce from "./hook/useDebounce";
import useFetchTodoAll from "./hook/useFetchTodoAll";
import useTodoSearch from "./hook/useTodoSearch";
import { FIND_OPTIONS, useTodoStore } from "./TodoStore";

export default function App() {
  const { fetchTodoAll } = useFetchTodoAll();
  const { todoSearch } = useTodoSearch();
  const { todoListState, todoSearchListState } = useTodoStore();
  const { setGlobalState } = useGlobalStore();

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    setGlobalState({ loading: true });
    fetchTodoAll({ page: 1 });
  }, []);

  const debouncedKeyword = useDebounce(searchKeyword, 200);
  useEffect(() => {
    if (searchKeyword) {
      setGlobalState({ loading: true });
      todoSearch({ keyword: debouncedKeyword });
    }
  }, [debouncedKeyword]);

  return (
    <div className="relative mx-auto flex h-full w-1/3 justify-center py-8 text-customText">
      <div className="flex h-full w-full flex-col">
        <nav className="ml-auto"> nav login</nav>
        <TodoCreate />

        <div className="mb-2 flex">
          <div className="flex gap-x-2">
            <FindOptionButton option={FIND_OPTIONS.ALL} />
            <FindOptionButton option={FIND_OPTIONS.IN_PROGRESS} />
            <FindOptionButton option={FIND_OPTIONS.DONE} />
          </div>

          <input
            placeholder="search"
            className="ml-auto"
            onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
          />
        </div>
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
