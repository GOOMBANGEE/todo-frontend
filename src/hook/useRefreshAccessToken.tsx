import { useEnvStore } from "../store/EnvStore.ts";
import { useTokenStore } from "../store/TokenStore.tsx";
import axios from "axios";
import { useUserStore } from "../store/UserStore.tsx";
import { useTodoStore } from "../store/TodoStore.ts";

export default function useRefreshAccessToken() {
  const { resetTodoListState, resetTodoSearchListState } = useTodoStore();
  const { setUserState, resetUserState } = useUserStore();
  const { setTokenState, setHeaderAccessToken } = useTokenStore();
  const { envState } = useEnvStore();

  let accessTokenExpires: number | undefined;
  const refreshAccessToken = async () => {
    // 새로고침 시 쿠키에서 cookieOptions 읽어오기
    try {
      const authUrl = envState.authUrl;
      // refreshToken를 쿠키에서 가져와서 실행
      const response = await axios.get(`${authUrl}/refresh`, {
        withCredentials: true,
      });

      // accessToken 헤더에 담아서 이후 요청보낼때는 Authorization 추가
      const accessToken = response.data.accessToken;
      accessTokenExpires = response.data.accessTokenExpires;
      setUserState({ username: response.data.username });
      setHeaderAccessToken(accessToken);
    } catch (err) {
      console.error(err);
      accessTokenExpires = undefined;
      resetTodoListState();
      resetTodoSearchListState();
      resetUserState();
      setTokenState({ accessToken: undefined });
    } finally {
      setTimeout(() => {
        if (accessTokenExpires) void refreshAccessToken();
      }, accessTokenExpires);
    }
  };

  return { refreshAccessToken };
}
