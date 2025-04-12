import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  tutorialSeen: boolean;
  setTutorialSeen: (seen: boolean) => void;
  resetTutorial: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      tutorialSeen: false,
      setTutorialSeen: (seen) => set({ tutorialSeen: seen }),
      resetTutorial: () => set({ tutorialSeen: false }),
    }),
    {
      name: 'vizin-preferences',
    }
  )
);