import { useEnvStore } from "../../store/EnvStore.ts";
import { useUserStore } from "../../store/UserStore.tsx";
import axios from "axios";

interface Props {
  username: string;
}

export default function useRegister() {
  const { userState } = useUserStore();
  const { envState } = useEnvStore();

  const register = async (props?: Readonly<Props>) => {
    const authUrl = envState.authUrl;

    try {
      await axios.post(
        `${authUrl}/register`,
        {
          username: props?.username ?? userState.username,
          password: userState.password ?? "password",
          confirmPassword: userState.confirmPassword ?? "password",
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
