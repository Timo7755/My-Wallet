'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { BudgetWithSpending } from '@/types/Budget';

async function getBudgets(month: string): Promise<{
  budgets?: BudgetWithSpending[];
  error?: string;
}> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  const [year, monthNum] = month.split('-').map(Number);
  const start = new Date(year, monthNum - 1, 1);
  const end = new Date(year, monthNum, 1);

  try {
    const budgets = await db.budget.findMany({
      where: {
        userId,
        OR: [
          { isRecurring: true },
          { targetMonth: month },
        ],
      },
      include: {
        transactions: {
          where: {
            amount: { lt: 0 },
            createdAt: { gte: start, lt: end },
          },
          select: { amount: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const result: BudgetWithSpending[] = budgets.map((b) => ({
      id: b.id,
      name: b.name,
      amount: b.amount,
      spent: Math.abs(b.transactions.reduce((sum, t) => sum + t.amount, 0)),
      isRecurring: b.isRecurring,
      targetMonth: b.targetMonth,
    }));

    return { budgets: result };
  } catch {
    return { error: 'Database error' };
  }
}

export default getBudgets;
