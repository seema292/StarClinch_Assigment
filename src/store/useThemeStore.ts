import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStoreState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

function applyDomTheme(theme: 'dark' | 'light') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        applyDomTheme(next);
        set({ theme: next });
      },
      setTheme: (theme) => {
        applyDomTheme(theme);
        set({ theme });
      },
    }),
    {
      name: 'starclinch-theme-v1',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyDomTheme(state.theme);
        }
      },
    }
  )
);
