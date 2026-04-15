'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { Transaction } from '@/types/Transaction';

async function getTransactions(options?: {
  month?: string;
  sort?: 'asc' | 'desc';
}): Promise<{ transactions?: Transaction[]; error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: 'User not found' };

  try {
    const where: Prisma.TransactionWhereInput = { userId };

    if (options?.month) {
      const [year, monthNum] = options.month.split('-').map(Number);
      where.createdAt = {
        gte: new Date(year, monthNum - 1, 1),
        lt: new Date(year, monthNum, 1),
      };
    }

    const transactions = await db.transaction.findMany({
      where,
      orderBy: { createdAt: options?.sort === 'asc' ? 'asc' : 'desc' },
    });

    return { transactions };
  } catch {
    return { error: 'Database error' };
  }
}

export default getTransactions;
