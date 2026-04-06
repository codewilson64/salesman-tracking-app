import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DraftProduct = {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
};

type VisitDraftState = {
  visitId: string | null;
  result: string | null;
  transactionType: string | null;
  notes: string;
  products: DraftProduct[];

  setAll: (data: Partial<VisitDraftState>) => void;
  reset: () => void;
};

export const useVisitDraftStore = create<VisitDraftState>()(
  persist(
    (set) => ({
      visitId: null,
      result: null,
      transactionType: null,
      notes: "",
      products: [],

      setAll: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      reset: () =>
        set({
          result: null,
          transactionType: null,
          notes: "",
          products: [],
        }),
    }),
    {
      name: "visit-draft-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);