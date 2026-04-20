'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { Transaction } from '@/types/Transaction';

async function getTransactions(options?: {
  month?: string;
  sort?: 'asc' | 'desc';
  category?: string;
}): Promise<{ transactions?: Transaction[]; error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: 'User not found' };

  try {
    const where: Prisma.TransactionWhereInput = { userId };

    if (options?.category) {
      where.category = options.category;
    }

    if (options?.month) {
      const [year, monthNum] = options.month.split('-').map(Number);
      where.date = {
        gte: new Date(Date.UTC(year, monthNum - 1, 1)),
        lt: new Date(Date.UTC(year, monthNum, 1)),
      };
    }

    const transactions = await db.transaction.findMany({
      where,
      orderBy: { date: options?.sort === 'asc' ? 'asc' : 'desc' },
    });

    return { transactions };
  } catch (e) {
    console.error('getTransactions error:', e);
    return { error: 'Database error' };
  }
}

export default getTransactions;
