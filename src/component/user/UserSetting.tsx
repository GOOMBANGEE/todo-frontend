import { useUserStore } from "../../store/UserStore.tsx";
import { FormEvent, useEffect } from "react";
import useLogout from "../../hook/user/useLogout.tsx";
import useUserDelete from "../../hook/user/useUserDelete.ts";
import useUserUpdate from "../../hook/user/useUserUpdate.ts";
import usePasswordRegex from "../../hook/user/usePasswordRegex.ts";
import ErrorMessage from "../ErrorMessage.tsx";

export default function UserSetting() {
  const { passwordRegex } = usePasswordRegex();
  const { logout } = useLogout();
  const { userUpdate } = useUserUpdate();
  const { userDelete } = useUserDelete();
  const { userState, setUserState } = useUserStore();

  // logout
  const handleClickLogout = async () => {
    if (await logout()) {
      window.location.reload();
    }
  };

  // user update password
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 유효성검사
    if (!passwordRegex({ password: userState.newPassword ?? "" })) return;
    if (userState.newPassword !== userState.newConfirmPassword) {
      setUserState({ passwordErrorMessage: "비밀번호가 일치하지 않습니다" });
      return;
    }
    userUpdate();
  };

  // user delete
  const handleClickDelete = async () => {
    if (await userDelete()) {
      window.location.reload();
    }
  };

  // click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userState.userSettingOpen &&
        !(e.target as HTMLElement).closest(".user-setting-modal")
      ) {
        setUserState({
          userSettingOpen: false,
          passwordErrorMessage: undefined,
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userState, setUserState]);

  return (
    <div
      className={`user-setting-modal absolute ${userState.userSettingOpen ? "" : "hidden"} z-10 rounded bg-customDark_6 px-6 py-4`}
    >
      {/* username */}
      <div>{userState.username}</div>
      {/* logout */}
      <button onClick={() => handleClickLogout()}>Logout</button>

      {/* user update */}
      <form onSubmit={handleSubmit}>
        <ul>
          {/* password */}
          <li className="mb-2">
            <input
              type={"password"}
              placeholder={"password"}
              value={userState.newPassword ?? ""}
              onChange={(e) =>
                setUserState({
                  newPassword: e.target.value,
                  passwordErrorMessage: undefined,
                })
              }
              className={"bg-customDark_3 text-customText"}
            />
          </li>

          {/* confirm password */}
          <li className="mb-2">
            <input
              type={"password"}
              placeholder={"confirm password"}
              value={userState.newConfirmPassword ?? ""}
              onChange={(e) =>
                setUserState({
                  newConfirmPassword: e.target.value,
                  passwordErrorMessage: undefined,
                })
              }
              className={"bg-customDark_3 text-customText"}
            />
          </li>
        </ul>
        <button type={"submit"}>apply</button>
      </form>

      {/* error message */}
      <ErrorMessage message={userState.passwordErrorMessage} />

      {/* delete */}
      <button onClick={handleClickDelete}>Delete</button>
    </div>
  );
}
