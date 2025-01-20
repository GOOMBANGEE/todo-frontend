import { useEnvStore } from "../../store/EnvStore.ts";
import { useUserStore } from "../../store/UserStore.tsx";
import axios from "axios";

export default function useUserUpdate() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();

  const userUpdate = async () => {
    const userUrl = envState.userUrl;
    try {
      await axios.patch(userUrl, {
        password: userState.newPassword,
        confirmPassword: userState.newConfirmPassword,
      });

      setUserState({ newPassword: undefined, newConfirmPassword: undefined });
    } catch (err) {
      console.log(err);
    }
  };

  return { userUpdate };
}
