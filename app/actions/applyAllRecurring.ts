'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function applyAllRecurring(): Promise<{ count?: number; error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    const recurring = await db.recurringExpense.findMany({ where: { userId } });
    if (recurring.length === 0) return { count: 0 };

    const now = new Date();
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    await db.transaction.createMany({
      data: recurring.map((r) => ({
        text: r.name,
        amount: -Math.abs(r.amount),
        category: r.category,
        date,
        userId,
      })),
    });

    revalidatePath('/');
    return { count: recurring.length };
  } catch {
    return { error: 'Failed to apply' };
  }
}

export default applyAllRecurring;
