import { create } from "zustand";

interface GlobalStore {
  globalState: GlobalState;
  setGlobalState: (set: Partial<GlobalState>) => void;
}

interface GlobalState {
  detail: boolean;
  initialRender: boolean;
  loading: boolean;
}

const initialGlobalState: GlobalState = {
  detail: false,
  initialRender: false,
  loading: false,
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  globalState: initialGlobalState,
  setGlobalState: (state) =>
    set((prev) => ({ globalState: { ...prev.globalState, ...state } })),
}));
