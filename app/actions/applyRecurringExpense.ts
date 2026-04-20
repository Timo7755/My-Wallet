'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function applyRecurringExpense(recurringId: string): Promise<{ error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    const recurring = await db.recurringExpense.findFirst({
      where: { id: recurringId, userId },
    });
    if (!recurring) return { error: 'Not found' };

    const now = new Date();
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    await db.transaction.create({
      data: {
        text: recurring.name,
        amount: -Math.abs(recurring.amount),
        category: recurring.category,
        date,
        userId,
      },
    });

    revalidatePath('/');
    return {};
  } catch {
    return { error: 'Failed to apply' };
  }
}

export default applyRecurringExpense;
