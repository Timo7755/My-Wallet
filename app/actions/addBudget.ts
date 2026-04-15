'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function addBudget(formData: FormData): Promise<{ error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  const name = (formData.get('name') as string)?.trim();
  const amount = parseFloat(formData.get('amount') as string);
  const isRecurring = formData.get('isRecurring') !== 'false';
  const targetMonth = isRecurring
    ? null
    : ((formData.get('targetMonth') as string) || null);

  if (!name || isNaN(amount) || amount <= 0) {
    return { error: 'Name and a valid amount are required' };
  }

  if (!isRecurring && !targetMonth) {
    return { error: 'A target month is required for one-time budgets' };
  }

  try {
    await db.budget.create({
      data: { name, amount, userId, isRecurring, targetMonth },
    });
    revalidatePath('/');
    return {};
  } catch {
    return { error: 'Failed to create budget' };
  }
}

export default addBudget;
