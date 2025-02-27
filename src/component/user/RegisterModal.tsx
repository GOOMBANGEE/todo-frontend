import { useUserStore } from "../../store/UserStore.tsx";
import { FormEvent, useEffect } from "react";
import useRegister from "../../hook/user/useRegister.ts";
import useRefreshAccessToken from "../../hook/useRefreshAccessToken.tsx";
import useUsernameRegex from "../../hook/user/useUsernameRegex.ts";
import usePasswordRegex from "../../hook/user/usePasswordRegex.ts";
import ErrorMessage from "../ErrorMessage.tsx";

export default function RegisterModal() {
  const { usernameRegex } = useUsernameRegex();
  const { passwordRegex } = usePasswordRegex();
  const { register } = useRegister();
  const { refreshAccessToken } = useRefreshAccessToken();
  const { userState, setUserState, resetUserState } = useUserStore();

  const handleClickLogin = () => {
    setUserState({ loginModalOpen: true, registerModalOpen: false });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // 유효성검사
    if (!usernameRegex()) return;
    if (!passwordRegex({ password: userState.password ?? "" })) return;
    if (userState.password !== userState.confirmPassword) {
      setUserState({ passwordErrorMessage: "비밀번호가 일치하지 않습니다" });
      return;
    }

    if (await register()) {
      refreshAccessToken();
      setUserState({ registerModalOpen: false });
    }
  };

  // click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userState.registerModalOpen &&
        !(e.target as HTMLElement).closest(".register-modal")
      ) {
        resetUserState();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userState, userState.registerModalOpen]);

  return (
    <div
      className={`fixed inset-0 flex h-full w-full items-center justify-center ${userState.registerModalOpen ? "" : "hidden"}`}
    >
      <div className="fixed inset-0 h-full w-full bg-customDark_3 opacity-70"></div>
      <div className="register-modal z-10 rounded bg-customDark_6 px-6 py-4">
        <form onSubmit={handleSubmit}>
          <ul className="flex w-full flex-col gap-y-2">
            {/* username */}
            <li className="mb-2 flex">
              <input
                placeholder={"username"}
                value={userState.username ?? ""}
                onChange={(e) =>
                  setUserState({
                    username: e.target.value,
                    usernameErrorMessage: undefined,
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
                  })
                }
                className={"bg-customDark_3 text-customText"}
              />
            </li>

            {/* password confirm */}
            <li className="mb-2">
              <input
                type={"password"}
                placeholder={"confirm password"}
                value={userState.confirmPassword ?? ""}
                onChange={(e) =>
                  setUserState({
                    confirmPassword: e.target.value,
                    passwordErrorMessage: undefined,
                  })
                }
                className={"bg-customDark_3 text-customText"}
              />
            </li>

            {/* register button */}
            <li className="text-sm">
              <button type={"submit"} className={"rounded"}>
                Register
              </button>
            </li>
          </ul>
        </form>

        {/* error message */}
        <ErrorMessage message={userState.usernameErrorMessage} />
        <ErrorMessage message={userState.passwordErrorMessage} />

        {/* login modal button */}
        <div className="text-sm">
          <button onClick={handleClickLogin} className={"rounded"}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
