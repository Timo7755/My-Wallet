'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

async function getUserBalance(): Promise<{
  balance?: number;
  error?: string;
}> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId },
    });

    const balance = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    return { balance };
  } catch (error) {
    return { error: 'Database error' };
  }
}

export default getUserBalance;
