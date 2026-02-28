import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ExpenseCategory = "veterinary" | "food" | "accessories" | "grooming" | "insurance" | "other";

export interface WalletExpense {
  id: string;
  catId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  receiptUrl?: string;
  ocrExtracted?: boolean;
}

export interface BudgetAlert {
  id: string;
  category: ExpenseCategory;
  monthlyLimit: number;
  currentSpend: number;
}

interface WalletState {
  expenses: WalletExpense[];
  budgetAlerts: BudgetAlert[];
  addExpense: (expense: WalletExpense) => void;
}

const MOCK_EXPENSES: WalletExpense[] = [
  { id: "we1", catId: "1", category: "veterinary", amount: 45, description: "Vaccino Trivalente RCP", date: "2026-02-10", ocrExtracted: true },
  { id: "we2", catId: "1", category: "food", amount: 32, description: "Royal Canin Indoor 4kg", date: "2026-02-08" },
  { id: "we3", catId: "1", category: "accessories", amount: 18, description: "Tiragraffi nuovo", date: "2026-02-05" },
  { id: "we4", catId: "2", category: "veterinary", amount: 80, description: "Esami del sangue completi", date: "2026-02-05", ocrExtracted: true },
  { id: "we5", catId: "1", category: "grooming", amount: 25, description: "Toelettatura completa", date: "2026-01-28" },
  { id: "we6", catId: "2", category: "food", amount: 28, description: "Cibo umido premium x12", date: "2026-01-25" },
  { id: "we7", catId: "1", category: "veterinary", amount: 20, description: "Sverminazione", date: "2026-01-15" },
  { id: "we8", catId: "1", category: "insurance", amount: 15, description: "Polizza sanitaria mensile", date: "2026-02-01" },
  { id: "we9", catId: "2", category: "accessories", amount: 12, description: "Collare con medaglietta", date: "2026-01-20" },
  { id: "we10", catId: "1", category: "food", amount: 35, description: "Snack e premietti vari", date: "2026-02-15" },
];

const MOCK_BUDGET_ALERTS: BudgetAlert[] = [
  { id: "ba1", category: "veterinary", monthlyLimit: 100, currentSpend: 145 },
  { id: "ba2", category: "food", monthlyLimit: 80, currentSpend: 67 },
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      expenses: MOCK_EXPENSES,
      budgetAlerts: MOCK_BUDGET_ALERTS,
      addExpense: (expense) => set((s) => ({ expenses: [expense, ...s.expenses] })),
    }),
    { name: "citycat-wallet" }
  )
);
