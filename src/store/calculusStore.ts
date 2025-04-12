import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CalculationHistory {
  id: string;
  function: string;
  lowerBound: number;
  upperBound: number;
  results: {
    arcLength: number;
    surfaceArea: number;
    volume: number;
  };
  timestamp: number;
}

interface CalculusState {
  history: CalculationHistory[];
  addToHistory: (calculation: Omit<CalculationHistory, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  getHistory: () => CalculationHistory[];
}

const MAX_HISTORY_ITEMS = 50;

export const useCalculusStore = create<CalculusState>()(
  persist(
    (set, get) => ({
      history: [],
      addToHistory: (calculation) => {
        try {
          set((state) => ({
            history: [
              {
                ...calculation,
                id: crypto.randomUUID(),
                timestamp: Date.now(),
              },
              ...state.history.slice(0, MAX_HISTORY_ITEMS - 1),
            ],
          }));
        } catch (error) {
          console.error('Failed to add calculation to history:', error);
        }
      },
      clearHistory: () => {
        try {
          set({ history: [] });
        } catch (error) {
          console.error('Failed to clear history:', error);
        }
      },
      getHistory: () => {
        try {
          return get().history;
        } catch (error) {
          console.error('Failed to get history:', error);
          return [];
        }
      },
    }),
    {
      name: 'vizin-calculus',
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) {
            console.warn('Failed to rehydrate calculus store');
            return;
          }
          
          // Validate and clean up corrupted data
          state.history = state.history.filter(item => (
            item &&
            typeof item.function === 'string' &&
            typeof item.lowerBound === 'number' &&
            typeof item.upperBound === 'number' &&
            typeof item.timestamp === 'number' &&
            item.results &&
            typeof item.results.arcLength === 'number' &&
            typeof item.results.surfaceArea === 'number' &&
            typeof item.results.volume === 'number'
          ));
        };
      },
    }
  )
);