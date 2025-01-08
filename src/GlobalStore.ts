import { create } from "zustand";

interface GlobalStore {
  globalState: GlobalState;
  setGlobalState: (set: GlobalState) => void;
}

interface GlobalState {
  detail: boolean;
}

const initialGlobalState: GlobalState = {
  detail: false,
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  globalState: initialGlobalState,
  setGlobalState: (state) =>
    set((prev) => ({ globalState: { ...prev.globalState, ...state } })),
}));
