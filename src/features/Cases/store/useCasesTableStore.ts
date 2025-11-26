import { create } from "zustand";

interface CasesTableStoreState {
  page: number;
  perPage: number;
  setPage: (page: number) => void;
}

export const useCasesTableStore = create<CasesTableStoreState>((set) => ({
  page: 1,
  perPage: 7,
  setPage: (page) => set({ page }),
}));
