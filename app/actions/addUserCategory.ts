'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function addUserCategory(name: string): Promise<{ error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: 'Name is required' };

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'User not found' };

  try {
    await db.userCategory.upsert({
      where: { name_userId: { name: trimmed, userId } },
      update: {},
      create: { name: trimmed, userId },
    });
    revalidatePath('/');
    return {};
  } catch {
    return { error: 'Failed to save category' };
  }
}

export default addUserCategory;
