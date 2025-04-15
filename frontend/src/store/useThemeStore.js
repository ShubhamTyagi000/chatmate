import { create } from "zustand";


const prefersDarkTheme = () => {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};




export const useThemeStore = create((set) => ({
    theme: prefersDarkTheme() === true ? 'dark' : 'light',
    setTheme: (theme) => {
        set({ theme: theme });
    }
}))