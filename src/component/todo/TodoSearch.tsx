import { useTodoStore } from "../../store/TodoStore.ts";
import useDebounce from "../../hook/useDebounce.ts";
import { useEffect } from "react";
import useTodoSearch from "../../hook/todo/useTodoSearch.ts";
import { useGlobalStore } from "../../store/GlobalStore.ts";
import { useTokenStore } from "../../store/TokenStore.tsx";

export default function TodoSearch() {
  const { todoSearch } = useTodoSearch();
  const { searchKeyword, setSearchKeyword } = useTodoStore();
  const { tokenState } = useTokenStore();
  const { setGlobalState } = useGlobalStore();

  const debouncedKeyword = useDebounce(searchKeyword, 200);
  useEffect(() => {
    if (searchKeyword && tokenState.accessToken) {
      setGlobalState({ loading: true });
      todoSearch({ keyword: debouncedKeyword, page: 1 });
    }
  }, [debouncedKeyword]);

  return (
    <input
      placeholder="search"
      className="ml-auto w-full rounded border border-customDark_6 bg-customDark_3 px-2 py-2"
      onChange={(e) => {
        setSearchKeyword(e.target.value);
      }}
    />
  );
}
