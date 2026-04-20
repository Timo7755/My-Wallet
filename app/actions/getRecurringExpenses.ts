'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { RecurringExpense } from '@/types/RecurringExpense';

async function getRecurringExpenses(): Promise<{ recurring?: RecurringExpense[]; error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    const recurring = await db.recurringExpense.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return { recurring };
  } catch {
    return { error: 'Failed to load recurring expenses' };
  }
}

export default getRecurringExpenses;
