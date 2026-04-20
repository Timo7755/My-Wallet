const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

const d = (year, month, day) => new Date(Date.UTC(year, month - 1, day));

async function main() {
  console.log('🌱 Seeding...');

  await db.user.deleteMany({ where: { email: 'demo@gmail.com' } });

  const hashedPassword = await bcrypt.hash('geslo123', 12);
  const user = await db.user.create({
    data: { name: 'Timotej Demo', email: 'demo@gmail.com', password: hashedPassword },
  });

  // ── Budgets ───────────────────────────────────────────────────────────────
  const [groceries, transport, dining, utilities, entertainment] = await Promise.all([
    db.budget.create({ data: { name: 'Groceries',     amount: 350, userId: user.id, isRecurring: true } }),
    db.budget.create({ data: { name: 'Transport',     amount: 150, userId: user.id, isRecurring: true } }),
    db.budget.create({ data: { name: 'Dining Out',    amount: 200, userId: user.id, isRecurring: true } }),
    db.budget.create({ data: { name: 'Utilities',     amount: 130, userId: user.id, isRecurring: true } }),
    db.budget.create({ data: { name: 'Entertainment', amount: 100, userId: user.id, isRecurring: true } }),
  ]);

  // ── Recurring expenses ────────────────────────────────────────────────────
  // lastAppliedMonth set to current month so auto-apply doesn't duplicate seed data
  await Promise.all([
    db.recurringExpense.create({ data: { name: 'Rent',    amount: 750,   category: 'Housing & Rent', dayOfMonth: 1,  autoApply: true, lastAppliedMonth: '2026-04', userId: user.id } }),
    db.recurringExpense.create({ data: { name: 'Car Loan',amount: 280,   category: 'Loans & Credit', dayOfMonth: 5,  autoApply: true, lastAppliedMonth: '2026-04', userId: user.id } }),
    db.recurringExpense.create({ data: { name: 'Netflix', amount: 15.99, category: 'Subscriptions',  dayOfMonth: 10, autoApply: true, lastAppliedMonth: '2026-04', userId: user.id } }),
    db.recurringExpense.create({ data: { name: 'Gym',     amount: 40,    category: 'Health & Medical',dayOfMonth: 1,  autoApply: true, lastAppliedMonth: '2026-04', userId: user.id } }),
  ]);

  // ── Transactions ──────────────────────────────────────────────────────────
  const txs = [

    // ── February 2026 ────────────────────────────────────────────────────────
    { text: 'Salary',      amount:  2800,   category: 'Salary',           date: d(2026, 2,  1), userId: user.id },
    { text: 'Rent',        amount:  -750,   category: 'Housing & Rent',   date: d(2026, 2,  1), userId: user.id },
    { text: 'Car Loan',    amount:  -280,   category: 'Loans & Credit',   date: d(2026, 2,  5), userId: user.id, comment: 'Monthly installment' },
    { text: 'Lidl',        amount:   -89.5, category: 'Food & Groceries', date: d(2026, 2,  6), userId: user.id, budgetId: groceries.id },
    { text: 'Fuel',        amount:   -65,   category: 'Gas & Fuel',       date: d(2026, 2,  7), userId: user.id, budgetId: transport.id },
    { text: 'Netflix',     amount:   -15.99,category: 'Subscriptions',    date: d(2026, 2, 10), userId: user.id },
    { text: 'Electricity', amount:   -72.4, category: 'Utilities',        date: d(2026, 2, 10), userId: user.id, budgetId: utilities.id },
    { text: 'Internet',    amount:   -29.99,category: 'Utilities',        date: d(2026, 2, 10), userId: user.id, budgetId: utilities.id },
    { text: 'Aldi',        amount:   -76.2, category: 'Food & Groceries', date: d(2026, 2, 13), userId: user.id, budgetId: groceries.id },
    { text: 'Restaurant',  amount:   -58,   category: 'Dining Out',       date: d(2026, 2, 14), userId: user.id, budgetId: dining.id, comment: "Valentine's dinner" },
    { text: 'Gym',         amount:   -40,   category: 'Health & Medical', date: d(2026, 2, 15), userId: user.id },
    { text: 'Mercator',    amount:   -91.3, category: 'Food & Groceries', date: d(2026, 2, 20), userId: user.id, budgetId: groceries.id },
    { text: 'Bus Pass',    amount:   -45,   category: 'Transport',        date: d(2026, 2, 22), userId: user.id, budgetId: transport.id },
    { text: 'Takeaway',    amount:   -22.5, category: 'Dining Out',       date: d(2026, 2, 24), userId: user.id, budgetId: dining.id },
    { text: 'Spar',        amount:   -58.8, category: 'Food & Groceries', date: d(2026, 2, 27), userId: user.id, budgetId: groceries.id },

    // ── March 2026 ────────────────────────────────────────────────────────────
    { text: 'Salary',        amount:  2800,   category: 'Salary',           date: d(2026, 3,  1), userId: user.id },
    { text: 'Rent',          amount:  -750,   category: 'Housing & Rent',   date: d(2026, 3,  1), userId: user.id },
    { text: 'Gym',           amount:   -40,   category: 'Health & Medical', date: d(2026, 3,  1), userId: user.id },
    { text: 'Car Loan',      amount:  -280,   category: 'Loans & Credit',   date: d(2026, 3,  5), userId: user.id, comment: 'Monthly installment' },
    { text: 'Lidl',          amount:   -82.1, category: 'Food & Groceries', date: d(2026, 3,  6), userId: user.id, budgetId: groceries.id },
    { text: 'Fuel',          amount:   -71,   category: 'Gas & Fuel',       date: d(2026, 3,  7), userId: user.id, budgetId: transport.id },
    { text: 'Netflix',       amount:   -15.99,category: 'Subscriptions',    date: d(2026, 3, 10), userId: user.id },
    { text: 'Electricity',   amount:   -68.3, category: 'Utilities',        date: d(2026, 3, 10), userId: user.id, budgetId: utilities.id },
    { text: 'Internet',      amount:   -29.99,category: 'Utilities',        date: d(2026, 3, 10), userId: user.id, budgetId: utilities.id },
    { text: 'Aldi',          amount:   -79.6, category: 'Food & Groceries', date: d(2026, 3, 13), userId: user.id, budgetId: groceries.id },
    { text: 'Cinema',        amount:   -24,   category: 'Entertainment',    date: d(2026, 3, 15), userId: user.id, budgetId: entertainment.id },
    { text: 'Restaurant',    amount:   -61,   category: 'Dining Out',       date: d(2026, 3, 16), userId: user.id, budgetId: dining.id },
    { text: 'Mercator',      amount:   -88.9, category: 'Food & Groceries', date: d(2026, 3, 21), userId: user.id, budgetId: groceries.id },
    { text: 'Bus Pass',      amount:   -45,   category: 'Transport',        date: d(2026, 3, 22), userId: user.id, budgetId: transport.id },
    { text: 'Friends Dinner',amount:   -55,   category: 'Dining Out',       date: d(2026, 3, 28), userId: user.id, budgetId: dining.id },

    // ── April 2026 (up to the 17th) ───────────────────────────────────────────
    { text: 'Salary',      amount:  2800,   category: 'Salary',           date: d(2026, 4,  1), userId: user.id },
    { text: 'Rent',        amount:  -750,   category: 'Housing & Rent',   date: d(2026, 4,  1), userId: user.id },
    { text: 'Gym',         amount:   -40,   category: 'Health & Medical', date: d(2026, 4,  1), userId: user.id },
    { text: 'Car Loan',    amount:  -280,   category: 'Loans & Credit',   date: d(2026, 4,  5), userId: user.id, comment: 'Monthly installment' },
    { text: 'Lidl',        amount:   -91.2, category: 'Food & Groceries', date: d(2026, 4,  5), userId: user.id, budgetId: groceries.id },
    { text: 'Netflix',     amount:   -15.99,category: 'Subscriptions',    date: d(2026, 4, 10), userId: user.id },
    { text: 'Electricity', amount:   -61.5, category: 'Utilities',        date: d(2026, 4, 10), userId: user.id, budgetId: utilities.id },
    { text: 'Internet',    amount:   -29.99,category: 'Utilities',        date: d(2026, 4, 10), userId: user.id, budgetId: utilities.id },
    { text: 'Fuel',        amount:   -68,   category: 'Gas & Fuel',       date: d(2026, 4, 12), userId: user.id, budgetId: transport.id },
    { text: 'Aldi',        amount:   -74.8, category: 'Food & Groceries', date: d(2026, 4, 14), userId: user.id, budgetId: groceries.id },
    { text: 'Restaurant',  amount:   -42,   category: 'Dining Out',       date: d(2026, 4, 16), userId: user.id, budgetId: dining.id },
  ];

  for (const tx of txs) {
    await db.transaction.create({ data: tx });
  }

  console.log('✅ Done!');
  console.log('');
  console.log('   Email:    demo@gmail.com');
  console.log('   Password: geslo123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
