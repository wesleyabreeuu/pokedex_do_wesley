import { create } from "zustand";

export type PokedexTab = "view" | "stats" | "info" | "evo" | null;

type PokedexState = {
  selectedTab: PokedexTab;
  setSelectedTab: (tab: PokedexTab) => void;
  toggleTab: (tab: Exclude<PokedexTab, null>) => void;
  resetTab: () => void;
};

export const usePokedexStore = create<PokedexState>((set) => ({
  selectedTab: null,
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  toggleTab: (tab) =>
    set((state) => ({
      selectedTab: state.selectedTab === tab ? null : tab,
    })),
  resetTab: () => set({ selectedTab: null }),
}));
