'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function deleteRecurringExpense(id: string): Promise<{ error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    await db.recurringExpense.delete({ where: { id, userId } });
    revalidatePath('/');
    return {};
  } catch {
    return { error: 'Failed to delete' };
  }
}

export default deleteRecurringExpense;
