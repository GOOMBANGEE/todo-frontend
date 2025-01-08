import { useEffect, useState } from "react";
import CreateTodo from "./component/CreateTodo";
import FindOptionButton from "./component/FindOptionButton";
import TodoList from "./component/TodoList";
import useFetchTodoAll from "./hook/useFetchTodoAll";
import useTodoSearch from "./hook/useTodoSearch";
import { FIND_OPTIONS, useTodoStore } from "./TodoStore";

export default function App() {
  const { fetchTodoAll } = useFetchTodoAll();
  const { todoSearch } = useTodoSearch();

  const { todoListState, searchTodoListState } = useTodoStore();

  useEffect(() => {
    fetchTodoAll({ page: 1 });
  }, []);

  // useEffect(() => {
  //   console.log("====================");
  //   console.log("title : ", todoState.title);
  //   console.log("description : ", todoState.description);
  //   console.log("startDate : ", todoState.startDate);
  //   console.log("endDate : ", todoState.endDate);
  // }, [todoState]);

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  return (
    <div className="text-customText relative mx-auto flex w-1/3 justify-center py-8">
      <div className="flex w-full flex-col">
        <nav className="ml-auto"> nav login</nav>
        <CreateTodo />

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
              todoSearch({ keyword: e.target.value });
            }}
          />
        </div>
        <div>
          {searchKeyword ? (
            <TodoList todoList={searchTodoListState.todoList} />
          ) : (
            <TodoList todoList={todoListState.todoList} />
          )}
        </div>
      </div>
    </div>
  );
}
