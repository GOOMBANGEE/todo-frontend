import { create } from "zustand";

const BASE_URL = import.meta.env.VITE_BASE_URL_HTTP;
const BASE_URL_TODO = import.meta.env.VITE_BASE_URL_TODO;
const TIME_LOCALE = import.meta.env.VITE_TIME_LOCALE;
const TIME_ZONE = import.meta.env.VITE_TIME_ZONE;

interface EnvStore {
  envState: EnvState;
  setEnvState: (state: Partial<EnvState>) => void;
}

interface EnvState {
  baseUrl: string;
  todoUrl: string;
  timeLocale: string;
  timeZone: string;
}

const initialEnvState: EnvState = {
  baseUrl: BASE_URL,
  todoUrl: BASE_URL_TODO,
  timeLocale: TIME_LOCALE,
  timeZone: TIME_ZONE,
};

export const useEnvStore = create<EnvStore>((set) => ({
  envState: initialEnvState,
  setEnvState: (state) =>
    set((prev) => ({ envState: { ...prev.envState, ...state } })),
}));
