import useLogin from "../../hook/user/useLogin.ts";
import { useUserStore } from "../../store/UserStore.tsx";
import { FormEvent, useEffect } from "react";
import useRefreshAccessToken from "../../hook/useRefreshAccessToken.tsx";
import useUsernameRegex from "../../hook/user/useUsernameRegex.ts";
import usePasswordRegex from "../../hook/user/usePasswordRegex.ts";
import ErrorMessage from "../ErrorMessage.tsx";

export default function LoginModal() {
  const { usernameRegex } = useUsernameRegex();
  const { passwordRegex } = usePasswordRegex();
  const { login } = useLogin();
  const { refreshAccessToken } = useRefreshAccessToken();
  const { userState, setUserState, resetUserState } = useUserStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // 유효성검사
    if (!usernameRegex()) return;
    if (!passwordRegex({ password: userState.password ?? "" })) return;

    if (await login()) {
      refreshAccessToken();
      setUserState({ loginModalOpen: false });
      return;
    }

    setUserState({
      loginErrorMessage: "유효하지 않은 유저명 또는 비밀번호입니다",
    });
  };

  const handleClickRegister = () => {
    setUserState({ loginModalOpen: false, registerModalOpen: true });
  };

  // click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userState.loginModalOpen &&
        !(e.target as HTMLElement).closest(".login-modal")
      ) {
        resetUserState();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userState, userState.loginModalOpen]);

  return (
    <div
      className={`fixed inset-0 flex h-full w-full items-center justify-center ${userState.loginModalOpen ? "" : "hidden"}`}
    >
      <div className="fixed inset-0 h-full w-full bg-customDark_3 opacity-70"></div>
      <div className="login-modal z-10 rounded bg-customDark_6 px-6 py-4">
        <form onSubmit={(e) => handleSubmit(e)}>
          <ul>
            {/* username */}
            <li className="mb-2 flex">
              <input
                placeholder={"username"}
                value={userState.username ?? ""}
                onChange={(e) =>
                  setUserState({
                    username: e.target.value,
                    usernameErrorMessage: undefined,
                    loginErrorMessage: undefined,
                  })
                }
                className={"bg-customDark_6 text-customText"}
              />
            </li>

            {/* password */}
            <li className="mb-2">
              <input
                type={"password"}
                placeholder={"password"}
                value={userState.password ?? ""}
                onChange={(e) =>
                  setUserState({
                    password: e.target.value,
                    passwordErrorMessage: undefined,
                    loginErrorMessage: undefined,
                  })
                }
                className={"bg-customDark_3 text-customText"}
              />
            </li>

            {/* login button */}
            <li className="text-sm">
              <button type={"submit"} className={"rounded"}>
                Login
              </button>
            </li>
          </ul>
        </form>

        {/* error message */}
        <ErrorMessage message={userState.usernameErrorMessage} />
        <ErrorMessage message={userState.passwordErrorMessage} />
        <ErrorMessage message={userState.loginErrorMessage} />

        {/* register modal button */}
        <div className="text-sm">
          <button onClick={handleClickRegister} className={"rounded"}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
