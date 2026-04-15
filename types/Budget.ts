export interface BudgetWithSpending {
  id: string;
  name: string;
  amount: number;
  spent: number;
  isRecurring: boolean;
  targetMonth: string | null;
}

export interface BudgetListItem {
  id: string;
  name: string;
}
