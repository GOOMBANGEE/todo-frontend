import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.ts";
import axios from "axios";
import { useTokenStore } from "../../store/TokenStore.tsx";

export default function useLogin() {
  const { userState, setUserState } = useUserStore();
  const { setHeaderAccessToken } = useTokenStore();
  const { envState } = useEnvStore();

  const login = async () => {
    try {
      const authUrl = envState.authUrl;
      const response = await axios.post(
        `${authUrl}/login`,
        {
          username: userState.username,
          password: userState.password,
        },
        {
          withCredentials: true,
        },
      );

      // accessToken 헤더에 담아서 이후 요청보낼때는 Authorization 추가
      const accessToken = response.data.accessToken;
      setUserState({ username: response.data.username });
      setHeaderAccessToken(accessToken);
      if (accessToken) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { login };
}
