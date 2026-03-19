// stores/salesmanStore.ts
import { create } from "zustand";
import { 
  createSalesmen, 
  deleteSalesmenById, 
  getAllSalesmen as fetchSalesmen, 
  getSalesmenById, 
  updateSalesmenById
} 
  from "../services/Salesmen/salesmenService";

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

interface CreateSalesmanInput {
  username: string;
  email: string;
  password: string;
  name: string;
  address?: string;
  phone?: string;
}

export interface UpdateSalesmanInput {
  name: string;
  address?: string;
  phone?: string;
}

interface SalesmenStore {
  salesmen: Salesmen[];
  selectedSalesmen: Salesmen | null;
  loading: boolean;
  error: string | null;
  getAllSalesmen: () => Promise<void>;
  getSalesmanById: (id: string) => Promise<void>;
  createSalesman: (data: CreateSalesmanInput) => Promise<void>;
  updateSalesman: (id: string, data: UpdateSalesmanInput) => Promise<void>;
  deleteSalesman: (id: string) => Promise<void>;
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

  createSalesman: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await createSalesmen(data);

      // optional: update list instantly (better UX)
      const newSalesman = res.data.salesman;

      set((state) => ({
        salesmen: [...state.salesmen, newSalesman],
        loading: false,
      }));

    } catch (err: any) {
      set({
        error:
          err.response?.data?.error ||
          err.message ||
          "Failed to create salesman",
        loading: false,
      });

      throw err;
    }
  },

  updateSalesman: async (id: string, data: UpdateSalesmanInput) => {
    set({ loading: true, error: null });

    try {
      const res = await updateSalesmenById(id, data);
      const updated = res.data.data;

      set((state) => ({
        salesmen: state.salesmen.map((s) =>
          s.id === id ? { ...s, ...updated } : s
        ),
        selectedSalesmen: updated,
        loading: false,
      }));

    } catch (err: any) {
      set({
        error:
          err.response?.data?.error ||
          err.message ||
          "Failed to update salesman",
        loading: false,
      });

      throw err;
    }
  },

  deleteSalesman: async (id) => {
    set({ loading: true, error: null });

    try {
      await deleteSalesmenById(id);

      set((state) => ({
        salesmen: state.salesmen.filter((s) => s.id !== id),
        selectedSalesmen: null,
        loading: false,
      }));

    } catch (err: any) {
      set({
        error:
          err.response?.data?.error ||
          err.message ||
          "Failed to delete salesman",
        loading: false,
      });

      throw err;
    }
  },
}));