// src/store.js
import create from "zustand";

const useStore = create((set) => ({
  score: 0,
  setScore: (score) => set({ score }),
}));

export default useStore;
