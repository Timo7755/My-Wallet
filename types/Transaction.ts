export interface Transaction {
  id: string;
  text: string;
  amount: number;
  userId: string;
  category: string | null;
  comment: string | null;
  date: Date;
  createdAt: Date;
}
