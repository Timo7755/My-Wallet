'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

async function getIncomeExpense(month?: string): Promise<{
  income?: number;
  expense?: number;
  error?: string;
}> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: 'User not found' };

  try {
    const where: Prisma.TransactionWhereInput = { userId };

    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      where.date = {
        gte: new Date(Date.UTC(year, monthNum - 1, 1)),
        lt: new Date(Date.UTC(year, monthNum, 1)),
      };
    }

    const transactions = await db.transaction.findMany({ where });
    const amounts = transactions.map((t) => t.amount);
    const income = amounts.filter((a) => a > 0).reduce((acc, a) => acc + a, 0);
    const expense = amounts.filter((a) => a < 0).reduce((acc, a) => acc + a, 0);

    return { income, expense: Math.abs(expense) };
  } catch {
    return { error: 'Database error' };
  }
}

export default getIncomeExpense;
