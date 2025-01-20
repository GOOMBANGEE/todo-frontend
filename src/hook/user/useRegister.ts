import { useEnvStore } from "../../store/EnvStore.ts";
import { useUserStore } from "../../store/UserStore.tsx";
import axios from "axios";

export default function useRegister() {
  const { userState } = useUserStore();
  const { envState } = useEnvStore();

  const register = async () => {
    const authUrl = envState.authUrl;

    try {
      await axios.post(
        `${authUrl}/register`,
        {
          username: userState.username,
          password: userState.password,
          confirmPassword: userState.confirmPassword,
        },
        { withCredentials: true },
      );

      return true;
    } catch (error) {
      console.error(error);
    }
  };

  return { register };
}
