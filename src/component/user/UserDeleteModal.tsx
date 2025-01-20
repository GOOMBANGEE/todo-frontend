import { useUserStore } from "../../store/UserStore.tsx";
import { useEffect } from "react";
import useUserDelete from "../../hook/user/useUserDelete.ts";

export default function UserDeleteModal() {
  const { userDelete } = useUserDelete();
  const { userState, setUserState } = useUserStore();

  const handleClickDelete = async () => {
    if (await userDelete()) {
      window.location.reload();
    }
  };

  const handleClickCancel = () => {
    setUserState({ userSettingUserDeleteModal: false });
  };

  // click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userState.userSettingUserDeleteModal &&
        !(e.target as HTMLElement).closest(".user-delete-modal")
      ) {
        setUserState({ userSettingUserDeleteModal: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userState, setUserState]);

  return (
    <div
      style={{ zIndex: 11 }}
      className={`fixed inset-0 flex h-full w-full items-center justify-center ${userState.userSettingUserDeleteModal ? "" : "hidden"}`}
    >
      <div className="fixed inset-0 h-full w-full bg-customDark_3 opacity-70"></div>
      <div className="user-delete-modal z-10 rounded bg-customDark_6 px-6 py-4">
        <div>Are you sure you want to delete your account?</div>
        <button onClick={handleClickDelete}>Delete</button>
        <button onClick={handleClickCancel}>Cancel</button>
      </div>
    </div>
  );
}
