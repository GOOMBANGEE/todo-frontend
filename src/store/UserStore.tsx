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
  usernameVerified: boolean;
  passwordVerified: boolean;
  usernameErrorMessage: string | undefined;
  passwordErrorMessage: string | undefined;

  // login
  loginModalOpen: boolean;
  loginErrorMessage: string | undefined;
}

const initialUserState: UserState = {
  id: undefined,
  username: undefined,
  password: undefined,

  // register
  registerModalOpen: false,
  confirmPassword: undefined,
  usernameVerified: false,
  passwordVerified: false,
  usernameErrorMessage: undefined,
  passwordErrorMessage: undefined,

  // login
  loginModalOpen: false,
  loginErrorMessage: undefined,
};

export const useUserStore = create<UserStore>((set) => ({
  userState: initialUserState,
  setUserState: (state) =>
    set((prev) => ({ userState: { ...prev.userState, ...state } })),
  resetUserState: () => set({ userState: initialUserState }),
}));
