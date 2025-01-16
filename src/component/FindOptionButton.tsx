import { useEffect } from "react";
import useFetchTodoAll from "../hook/useFetchTodoAll";
import useFetchTodoDone from "../hook/useFetchTodoDone";
import useFetchTodoInProgress from "../hook/useFetchTodoInProgress";
import { FIND_OPTIONS, FindOption, useTodoStore } from "../TodoStore";
import useTodoSearch from "../hook/useTodoSearch.ts";

interface Props {
  option: FindOption;
}

export default function FindOptionButton(props: Readonly<Props>) {
  const { fetchTodoAll } = useFetchTodoAll();
  const { fetchTodoInProgress } = useFetchTodoInProgress();
  const { fetchTodoDone } = useFetchTodoDone();
  const { todoSearch } = useTodoSearch();

  const { findOption, setFindOption, searchKeyword } = useTodoStore();

  useEffect(() => {
    if (searchKeyword) {
      todoSearch({ keyword: searchKeyword, page: 1 });
    } else {
      const fetchMap: Record<
        FindOption,
        (props: { page: number }) => Promise<void>
      > = {
        [FIND_OPTIONS.ALL]: fetchTodoAll,
        [FIND_OPTIONS.IN_PROGRESS]: fetchTodoInProgress,
        [FIND_OPTIONS.DONE]: fetchTodoDone,
      };
      const fetchFunction = fetchMap[findOption];
      fetchFunction({ page: 1 });
    }
  }, [findOption]);

  return (
    <button
      onClick={() => {
        setFindOption(props.option);
      }}
      className={`rounded px-1 text-sm font-semibold ${findOption === props.option ? "bg-green-600 text-customText" : "bg-white text-customDark_3"}`}
    >
      {props.option}
    </button>
  );
}
