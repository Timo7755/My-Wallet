'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

async function getUserCategories(): Promise<{ categories?: string[]; error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    const rows = await db.userCategory.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { name: true },
    });
    return { categories: rows.map((r) => r.name) };
  } catch {
    return { error: 'Failed to load categories' };
  }
}

export default getUserCategories;
