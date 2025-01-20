import { useEnvStore } from "../../store/EnvStore.ts";
import axios from "axios";

export default function useUserDelete() {
  const { envState } = useEnvStore();

  const userDelete = async () => {
    const userUrl = envState.userUrl;
    try {
      await axios.delete(`${userUrl}`);
      return true;
    } catch (err) {
      console.error(err);
    }
  };

  return { userDelete };
}
