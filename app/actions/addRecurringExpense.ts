'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function addRecurringExpense(formData: FormData): Promise<{ error?: string }> {
  const name = formData.get('name') as string;
  const amountStr = (formData.get('amount') as string).replace(',', '.');
  const category = (formData.get('category') as string) || null;
  const dayOfMonth = Math.min(31, Math.max(1, parseInt(formData.get('dayOfMonth') as string) || 1));
  const autoApply = formData.get('autoApply') === 'true';

  if (!name || !amountStr) return { error: 'Name and amount are required' };
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return { error: 'Invalid amount' };

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    await db.recurringExpense.create({ data: { name, amount, category, dayOfMonth, autoApply, userId } });
    revalidatePath('/');
    return {};
  } catch {
    return { error: 'Failed to add recurring expense' };
  }
}

export default addRecurringExpense;
