'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface TransactionResult {
  data?: { text: string; amount: number };
  error?: string;
}

async function addTransaction(formData: FormData): Promise<TransactionResult> {
  const textValue = formData.get('text');
  const amountValue = formData.get('amount');

  if (!textValue || textValue === '' || !amountValue) {
    return { error: 'Text or amount is missing' };
  }

  const text = textValue.toString();
  const amount = parseFloat(amountValue.toString());
  const budgetId = (formData.get('budgetId') as string) || null;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    const transactionData = await db.transaction.create({
      data: { text, amount, userId, budgetId },
    });

    revalidatePath('/');
    return { data: transactionData };
  } catch {
    return { error: 'Transaction not added' };
  }
}

export default addTransaction;
