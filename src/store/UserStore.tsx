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

  // login
  loginModalOpen: boolean;
  loginErrorMessage: string | undefined;
}

const initialUserState: UserState = {
  id: undefined,
  username: undefined,
  password: undefined,

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
