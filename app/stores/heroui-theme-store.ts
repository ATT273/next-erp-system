// import { ThemeProviderProps } from "next-themes";
import { create } from "zustand";
export type ThemeKey = string | number | bigint;

interface IState {
  theme: string;
  setTheme: (theme: string) => void;
}
export const useHeroUIThemeStore = create<IState>((set) => ({
  theme: "light",
  setTheme: (theme: string) => set((state) => ({ ...state, theme })),
}));
