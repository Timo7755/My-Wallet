'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Toggles a budget between recurring and one-time.
// When making it one-time, currentMonth sets which month it applies to.
async function toggleBudgetRecurring(
  budgetId: string,
  makeRecurring: boolean,
  currentMonth: string
): Promise<{ error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    await db.budget.update({
      where: { id: budgetId, userId },
      data: {
        isRecurring: makeRecurring,
        targetMonth: makeRecurring ? null : currentMonth,
      },
    });
    revalidatePath('/');
    return {};
  } catch {
    return { error: 'Failed to update budget' };
  }
}

export default toggleBudgetRecurring;
