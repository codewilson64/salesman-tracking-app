// stores/salesmanStore.ts
import { create } from "zustand";
import { getAllSalesmen as fetchSalesmen, getSalesmenById } from "../services/Salesmen/salesmenService";

interface Salesmen {
  id: string;
  name: string;
  address: string;
  phone: string;
  userId: string;
  username: string;
  email: string;
  role: string;
}

interface SalesmenStore {
  salesmen: Salesmen[];
  selectedSalesmen: Salesmen | null;
  loading: boolean;
  error: string | null;
  getAllSalesmen: () => Promise<void>;
  getSalesmanById: (id: string) => Promise<void>;
}

export const useSalesmanStore = create<SalesmenStore>((set) => ({
  salesmen: [],
  selectedSalesmen: null,
  loading: false,
  error: null,

  getAllSalesmen: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchSalesmen();
      set({ salesmen: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch salesmen",
        loading: false,
      });
    }
  },

  getSalesmanById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await getSalesmenById(id);

      set({ selectedSalesmen: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch salesman by id",
        loading: false,
      });
    }
  },
}));