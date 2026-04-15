// stores/visitStore.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { VisitDraft, VisitDraftState } from "../types/visitDraft";

const defaultDraft: VisitDraft = {
  result: null,
  transactionType: null,
  products: [],
  paidAmount: 0,         
  paymentType: null,      
  orderBy: "",
  notes: "",
};

export const useVisitDraftStore = create<VisitDraftState>()(
  persist(
    (set, get) => ({
      drafts: {},

      setDraft: (visitId, data) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [visitId]: {
              ...(state.drafts[visitId] || defaultDraft),
              ...data,
            },
          },
        })),

      getDraft: (visitId) => {
        return get().drafts[visitId];
      },

      resetDraft: (visitId) =>
        set((state) => {
          const newDrafts = { ...state.drafts };
          delete newDrafts[visitId];
          return { drafts: newDrafts };
        }),
    }),
    {
      name: "visit-draft-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);