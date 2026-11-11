import { create } from "zustand";
import { persist } from "zustand/middleware";

type SavedState = {
  ids: string[];
  hydrated: boolean;
  toggle: (id: string) => void;
};

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      ids: [],
      hydrated: false,
      toggle: (id) => {
        const ids = get().ids;
        set({
          ids: ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
        });
      },
    }),
    {
      name: "harbor-saved",
      skipHydration: true,
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);
