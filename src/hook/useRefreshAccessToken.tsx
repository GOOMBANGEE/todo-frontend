import { useEnvStore } from "../store/EnvStore.ts";
import { useTokenStore } from "../store/TokenStore.tsx";
import axios from "axios";
import { useUserStore } from "../store/UserStore.tsx";

export default function useRefreshAccessToken() {
  const { setUserState } = useUserStore();
  const { tokenState, setHeaderAccessToken } = useTokenStore();
  const { envState } = useEnvStore();

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
      setUserState({ username: response.data.username });
      setHeaderAccessToken(accessToken);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        void refreshAccessToken();
      }, tokenState.accessTokenExpireTime);
    }
  };

  return { refreshAccessToken };
}
