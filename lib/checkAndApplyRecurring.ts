import { db } from '@/lib/db';

export async function checkAndApplyRecurring(userId: string): Promise<void> {
  try {
    const now = new Date();
    const today = now.getDate();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const recurring = await db.recurringExpense.findMany({
      where: { userId, autoApply: true },
    });

    const toApply = recurring.filter(
      (r) => r.lastAppliedMonth !== currentMonth && today >= Math.min(r.dayOfMonth, daysInMonth)
    );

    for (const r of toApply) {
      const effectiveDay = Math.min(r.dayOfMonth, daysInMonth);
      const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), effectiveDay));

      await db.transaction.create({
        data: { text: r.name, amount: -Math.abs(r.amount), category: r.category, date, userId },
      });

      await db.recurringExpense.update({
        where: { id: r.id },
        data: { lastAppliedMonth: currentMonth },
      });
    }
  } catch (e) {
    console.error('checkAndApplyRecurring error:', e);
  }
}
