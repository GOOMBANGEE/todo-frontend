import { useUserStore } from "../../store/UserStore.tsx";
import { useTokenStore } from "../../store/TokenStore.tsx";
import useLogout from "../../hook/user/useLogout.tsx";

export default function AuthButton() {
  const { logout } = useLogout();
  const { setUserState } = useUserStore();
  const { tokenState } = useTokenStore();

  const handleClickLogout = async () => {
    if (await logout()) {
      window.location.reload();
    }
  };

  return (
    <div className="ml-auto">
      {tokenState.accessToken ? (
        <button onClick={() => handleClickLogout()}>Logout</button>
      ) : (
        <button onClick={() => setUserState({ loginModalOpen: true })}>
          Login
        </button>
      )}
    </div>
  );
}
