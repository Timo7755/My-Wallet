'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function updateRecurringExpense(
  id: string,
  data: { autoApply?: boolean; dayOfMonth?: number }
): Promise<{ error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    await db.recurringExpense.update({ where: { id, userId }, data });
    revalidatePath('/');
    return {};
  } catch {
    return { error: 'Failed to update' };
  }
}

export default updateRecurringExpense;
