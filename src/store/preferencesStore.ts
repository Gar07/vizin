import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  tutorialSeen: boolean;
  isManualTutorial: boolean;
  setTutorialSeen: (seen: boolean) => void;
  setManualTutorial: (isManual: boolean) => void;
  resetTutorial: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      tutorialSeen: false,
      isManualTutorial: false,
      setTutorialSeen: (seen) => set({ tutorialSeen: seen }),
      setManualTutorial: (isManual) => set({ isManualTutorial: isManual }),
      resetTutorial: () => set({ tutorialSeen: false, isManualTutorial: true }),
    }),
    {
      name: 'vizin-preferences',
    }
  )
);