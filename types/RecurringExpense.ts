export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string | null;
  dayOfMonth: number;
  autoApply: boolean;
  lastAppliedMonth: string | null;
  userId: string;
  createdAt: Date;
}
