'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function updateTransaction(
  transactionId: string,
  data: { text: string; amount: number; category?: string | null; comment?: string | null; date?: Date }
): Promise<{ error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: 'User not found' };

  try {
    await db.transaction.update({
      where: { id: transactionId, userId },
      data: {
        text: data.text,
        amount: data.amount,
        ...(data.category !== undefined && { category: data.category }),
        ...(data.comment !== undefined && { comment: data.comment }),
        ...(data.date && { date: data.date }),
      },
    });

    revalidatePath('/');
    return {};
  } catch {
    return { error: 'Failed to update transaction' };
  }
}

export default updateTransaction;
