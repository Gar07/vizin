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
}

export const useCalculusStore = create<CalculusState>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (calculation) => set((state) => ({
        history: [
          {
            ...calculation,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
          },
          ...state.history.slice(0, 9), // Keep only last 10 calculations
        ],
      })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'calculus-storage',
    }
  )
);