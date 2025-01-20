import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.ts";
import axios from "axios";
import { useTokenStore } from "../../store/TokenStore.tsx";

export default function useLogin() {
  const { userState } = useUserStore();
  const { setHeaderAccessToken } = useTokenStore();
  const { envState } = useEnvStore();

  const login = async () => {
    const authUrl = envState.authUrl;
    try {
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
