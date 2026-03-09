import { create } from 'zustand';

interface Company {
  id: string;
  name: string;
  industry: string;
  revenue_base: number;
  growth_rate: number;
  margin_base: number;
}

interface Activity {
  id: number;
  timestamp: string;
  agent_name: string;
  activity_type: string;
  message: string;
  company_id: string | null;
}

interface FpaState {
  companies: Company[];
  activities: Activity[];
  selectedCompanyId: string | null;
  isLoading: boolean;
  fetchCompanies: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  setSelectedCompany: (id: string | null) => void;
}

export const useStore = create<FpaState>((set) => ({
  companies: [],
  activities: [],
  selectedCompanyId: null,
  isLoading: false,
  fetchCompanies: async () => {
    set({ isLoading: true });
    const res = await fetch('/api/companies');
    const data = await res.json();
    set({ companies: data, isLoading: false });
  },
  fetchActivities: async () => {
    const res = await fetch('/api/activity');
    const data = await res.json();
    set({ activities: data });
  },
  setSelectedCompany: (id) => set({ selectedCompanyId: id }),
}));
