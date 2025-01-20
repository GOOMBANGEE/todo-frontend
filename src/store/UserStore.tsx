import { create } from "zustand";

interface UserStore {
  userState: UserState;
  setUserState: (state: Partial<UserState>) => void;
  resetUserState: () => void;
}

interface UserState {
  id: number | undefined;
  username: string | undefined;
  password: string | undefined;

  // register
  registerModalOpen: boolean;
  confirmPassword: string | undefined;
  usernameErrorMessage: string | undefined;
  passwordErrorMessage: string | undefined;

  // login
  loginModalOpen: boolean;
  loginErrorMessage: string | undefined;

  // user setting
  userSettingOpen: boolean;
  newPassword: string | undefined;
  newConfirmPassword: string | undefined;
  userSettingUserDeleteModal: boolean;
}

const initialUserState: UserState = {
  id: undefined,
  username: undefined,
  password: undefined,

  // register
  registerModalOpen: false,
  confirmPassword: undefined,
  usernameErrorMessage: undefined,
  passwordErrorMessage: undefined,

  // login
  loginModalOpen: false,
  loginErrorMessage: undefined,

  // user setting
  userSettingOpen: false,
  newPassword: undefined,
  newConfirmPassword: undefined,
  userSettingUserDeleteModal: false,
};

export const useUserStore = create<UserStore>((set) => ({
  userState: initialUserState,
  setUserState: (state) =>
    set((prev) => ({ userState: { ...prev.userState, ...state } })),
  resetUserState: () => set({ userState: initialUserState }),
}));
