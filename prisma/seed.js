const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

const d = (year, month, day) => new Date(year, month - 1, day);

async function main() {
  console.log('🌱 Seeding demo user...');

  // Remove existing demo user (cascades to budgets + transactions)
  await db.user.deleteMany({ where: { email: 'demo@mywallet.com' } });

  const hashedPassword = await bcrypt.hash('demo1234', 12);

  const user = await db.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'demo@mywallet.com',
      password: hashedPassword,
    },
  });

  // ── Budgets ──────────────────────────────────────────────────────────────
  const [groceries, transport, entertainment, dining, utilities, xmas] =
    await Promise.all([
      db.budget.create({ data: { name: 'Groceries',       amount: 400, userId: user.id, isRecurring: true } }),
      db.budget.create({ data: { name: 'Transport',       amount: 150, userId: user.id, isRecurring: true } }),
      db.budget.create({ data: { name: 'Entertainment',   amount: 200, userId: user.id, isRecurring: true } }),
      db.budget.create({ data: { name: 'Dining Out',      amount: 250, userId: user.id, isRecurring: true } }),
      db.budget.create({ data: { name: 'Utilities',       amount: 130, userId: user.id, isRecurring: true } }),
      db.budget.create({ data: { name: 'Christmas Gifts', amount: 600, userId: user.id, isRecurring: false, targetMonth: '2025-12' } }),
    ]);

  // ── Transactions ──────────────────────────────────────────────────────────
  const txs = [
    // ── December 2025 ────────────────────────────────────────────────────
    // Income
    { text: 'December Salary',       amount:  3200.00, userId: user.id, createdAt: d(2025, 12,  1) },
    { text: 'Freelance Project',      amount:   850.00, userId: user.id, createdAt: d(2025, 12, 15) },
    // Rent (no budget)
    { text: 'Rent',                   amount:  -900.00, userId: user.id, createdAt: d(2025, 12,  2) },
    // Groceries — total ~€350 (under €400 limit)
    { text: 'Lidl',                   amount:   -87.50, userId: user.id, budgetId: groceries.id,     createdAt: d(2025, 12,  3) },
    { text: 'Aldi',                   amount:   -72.30, userId: user.id, budgetId: groceries.id,     createdAt: d(2025, 12,  8) },
    { text: 'Mercator',               amount:   -95.10, userId: user.id, budgetId: groceries.id,     createdAt: d(2025, 12, 15) },
    { text: 'Lidl',                   amount:   -68.40, userId: user.id, budgetId: groceries.id,     createdAt: d(2025, 12, 22) },
    { text: 'Spar — Christmas food',  amount:   -61.80, userId: user.id, budgetId: groceries.id,     createdAt: d(2025, 12, 28) },
    // Transport — total €132
    { text: 'Monthly Bus Pass',       amount:   -80.00, userId: user.id, budgetId: transport.id,     createdAt: d(2025, 12,  4) },
    { text: 'Fuel',                   amount:   -52.30, userId: user.id, budgetId: transport.id,     createdAt: d(2025, 12, 18) },
    // Entertainment — total €196 (just under limit)
    { text: 'Netflix',                amount:   -15.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2025, 12,  5) },
    { text: 'Spotify',                amount:    -9.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2025, 12,  5) },
    { text: 'Cinema',                 amount:   -24.00, userId: user.id, budgetId: entertainment.id, createdAt: d(2025, 12, 13) },
    { text: 'Steam — Winter Sale',    amount:   -49.97, userId: user.id, budgetId: entertainment.id, createdAt: d(2025, 12, 20) },
    { text: 'Gaming Subscription',    amount:   -12.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2025, 12, 22) },
    { text: 'Concert Tickets',        amount:   -83.00, userId: user.id, budgetId: entertainment.id, createdAt: d(2025, 12, 27) },
    // Christmas Gifts — total €640 (OVER €600 limit — showcase red bar)
    { text: 'Amazon — Gifts',         amount:  -187.50, userId: user.id, budgetId: xmas.id,          createdAt: d(2025, 12,  5) },
    { text: 'H&M — Gifts',            amount:   -98.00, userId: user.id, budgetId: xmas.id,          createdAt: d(2025, 12, 10) },
    { text: 'Electronics Store',      amount:  -215.00, userId: user.id, budgetId: xmas.id,          createdAt: d(2025, 12, 14) },
    { text: 'Book Shop — Gifts',      amount:   -42.50, userId: user.id, budgetId: xmas.id,          createdAt: d(2025, 12, 17) },
    { text: 'Last Minute Gifts',      amount:   -97.00, userId: user.id, budgetId: xmas.id,          createdAt: d(2025, 12, 23) },
    // Dining — total €260 (OVER €250 limit)
    { text: 'Restaurant La Bella',    amount:   -65.00, userId: user.id, budgetId: dining.id,        createdAt: d(2025, 12,  7) },
    { text: 'Friends Dinner',         amount:   -48.50, userId: user.id, budgetId: dining.id,        createdAt: d(2025, 12, 21) },
    { text: 'Christmas Party',        amount:   -85.00, userId: user.id, budgetId: dining.id,        createdAt: d(2025, 12, 23) },
    { text: 'New Year\'s Eve dinner', amount:   -61.50, userId: user.id, budgetId: dining.id,        createdAt: d(2025, 12, 31) },
    // Utilities — total €127
    { text: 'Electricity Bill',       amount:   -72.40, userId: user.id, budgetId: utilities.id,     createdAt: d(2025, 12,  6) },
    { text: 'Internet',               amount:   -29.99, userId: user.id, budgetId: utilities.id,     createdAt: d(2025, 12, 10) },
    { text: 'Phone Bill',             amount:   -25.00, userId: user.id, budgetId: utilities.id,     createdAt: d(2025, 12, 10) },

    // ── January 2026 ─────────────────────────────────────────────────────
    // Income
    { text: 'January Salary',         amount:  3200.00, userId: user.id, createdAt: d(2026,  1,  1) },
    // Rent
    { text: 'Rent',                   amount:  -900.00, userId: user.id, createdAt: d(2026,  1,  2) },
    // Groceries — total €287 (well under budget — recovery month)
    { text: 'Hofer',                  amount:   -82.10, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  1,  4) },
    { text: 'Lidl',                   amount:   -76.50, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  1, 11) },
    { text: 'Spar',                   amount:   -54.20, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  1, 18) },
    { text: 'Aldi',                   amount:   -74.80, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  1, 25) },
    // Transport — total €80 (very light month)
    { text: 'Monthly Bus Pass',       amount:   -80.00, userId: user.id, budgetId: transport.id,     createdAt: d(2026,  1,  3) },
    // Entertainment — total €112
    { text: 'Netflix',                amount:   -15.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  1,  5) },
    { text: 'Spotify',                amount:    -9.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  1,  5) },
    { text: 'Cinema',                 amount:   -18.00, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  1, 17) },
    { text: 'Gaming Subscription',    amount:   -12.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  1,  5) },
    { text: 'Book',                   amount:   -22.50, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  1, 22) },
    { text: 'Museum',                 amount:   -32.00, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  1, 28) },
    // Dining — total €77.50 (light January)
    { text: 'Restaurant',             amount:   -55.00, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  1, 10) },
    { text: 'Takeaway',               amount:   -22.50, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  1, 19) },
    // Utilities — total €125
    { text: 'Electricity Bill',       amount:   -68.50, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  1,  6) },
    { text: 'Internet',               amount:   -29.99, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  1, 10) },
    { text: 'Phone Bill',             amount:   -25.00, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  1, 10) },
    // Misc (no budget)
    { text: 'Winter Clothes',         amount:  -125.00, userId: user.id, createdAt: d(2026,  1, 15) },

    // ── February 2026 ────────────────────────────────────────────────────
    // Income
    { text: 'February Salary',        amount:  3200.00, userId: user.id, createdAt: d(2026,  2,  1) },
    { text: 'Tax Refund',             amount:   450.00, userId: user.id, createdAt: d(2026,  2, 14) },
    // Rent
    { text: 'Rent',                   amount:  -900.00, userId: user.id, createdAt: d(2026,  2,  2) },
    // Groceries — total €313
    { text: 'Lidl',                   amount:   -88.40, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  2,  3) },
    { text: 'Aldi',                   amount:   -71.20, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  2, 10) },
    { text: 'Mercator',               amount:   -92.60, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  2, 17) },
    { text: 'Spar',                   amount:   -61.80, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  2, 24) },
    // Transport — total €127.50
    { text: 'Monthly Bus Pass',       amount:   -80.00, userId: user.id, budgetId: transport.id,     createdAt: d(2026,  2,  3) },
    { text: 'Fuel',                   amount:   -47.50, userId: user.id, budgetId: transport.id,     createdAt: d(2026,  2, 20) },
    // Entertainment — total €198 (close to limit — Valentine's)
    { text: 'Netflix',                amount:   -15.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  2,  5) },
    { text: 'Spotify',                amount:    -9.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  2,  5) },
    { text: 'Gaming Subscription',    amount:   -12.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  2,  5) },
    { text: 'Concert Tickets',        amount:   -78.00, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  2, 14) },
    { text: 'Cinema',                 amount:   -32.00, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  2, 21) },
    { text: 'Online Course',          amount:   -49.00, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  2, 26) },
    // Dining — total €271 (OVER €250 — Valentine's dinner)
    { text: 'Restaurant Le Monde',    amount:   -92.00, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  2, 14) },
    { text: 'Restaurant',             amount:   -48.00, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  2,  8) },
    { text: 'Takeaway',               amount:   -31.50, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  2, 22) },
    { text: 'Friends Brunch',         amount:   -45.00, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  2, 28) },
    // Utilities — total €127
    { text: 'Electricity Bill',       amount:   -75.20, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  2,  6) },
    { text: 'Internet',               amount:   -29.99, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  2, 10) },
    { text: 'Phone Bill',             amount:   -25.00, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  2, 10) },

    // ── March 2026 ───────────────────────────────────────────────────────
    // Income
    { text: 'March Salary',           amount:  3200.00, userId: user.id, createdAt: d(2026,  3,  1) },
    // Rent
    { text: 'Rent',                   amount:  -900.00, userId: user.id, createdAt: d(2026,  3,  2) },
    // Groceries — total €407 (slightly OVER budget)
    { text: 'Lidl',                   amount:   -79.30, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  3,  3) },
    { text: 'Aldi',                   amount:   -83.10, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  3, 10) },
    { text: 'Mercator',               amount:   -67.50, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  3, 17) },
    { text: 'Spar',                   amount:   -91.20, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  3, 24) },
    { text: 'Easter Shopping',        amount:   -86.40, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  3, 30) },
    // Transport — total €95
    { text: 'Monthly Bus Pass',       amount:   -80.00, userId: user.id, budgetId: transport.id,     createdAt: d(2026,  3,  3) },
    { text: 'Parking',                amount:   -15.00, userId: user.id, budgetId: transport.id,     createdAt: d(2026,  3, 12) },
    // Entertainment — total €122
    { text: 'Netflix',                amount:   -15.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  3,  5) },
    { text: 'Spotify',                amount:    -9.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  3,  5) },
    { text: 'Gaming Subscription',    amount:   -12.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  3,  5) },
    { text: 'Museum Visit',           amount:   -22.00, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  3, 21) },
    { text: 'Theatre Tickets',        amount:   -61.00, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  3, 25) },
    // Dining — total €147.50
    { text: 'Restaurant',             amount:   -72.00, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  3,  7) },
    { text: 'Pizza Night',            amount:   -34.50, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  3, 15) },
    { text: 'Friends Brunch',         amount:   -41.00, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  3, 28) },
    // Utilities — total €116
    { text: 'Electricity Bill',       amount:   -61.30, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  3,  6) },
    { text: 'Internet',               amount:   -29.99, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  3, 10) },
    { text: 'Phone Bill',             amount:   -25.00, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  3, 10) },
    // Misc (no budget)
    { text: 'Gym Membership',         amount:   -45.00, userId: user.id, createdAt: d(2026,  3,  1) },
    { text: 'Doctor Visit',           amount:   -35.00, userId: user.id, createdAt: d(2026,  3, 19) },

    // ── April 2026 (partial — up to Apr 14) ─────────────────────────────
    // Income
    { text: 'April Salary',           amount:  3200.00, userId: user.id, createdAt: d(2026,  4,  1) },
    // Rent
    { text: 'Rent',                   amount:  -900.00, userId: user.id, createdAt: d(2026,  4,  2) },
    // Groceries — partial, €158
    { text: 'Lidl',                   amount:   -85.60, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  4,  4) },
    { text: 'Aldi',                   amount:   -72.40, userId: user.id, budgetId: groceries.id,     createdAt: d(2026,  4, 11) },
    // Transport — partial
    { text: 'Monthly Bus Pass',       amount:   -80.00, userId: user.id, budgetId: transport.id,     createdAt: d(2026,  4,  3) },
    // Entertainment — partial
    { text: 'Netflix',                amount:   -15.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  4,  5) },
    { text: 'Spotify',                amount:    -9.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  4,  5) },
    { text: 'Gaming Subscription',    amount:   -12.99, userId: user.id, budgetId: entertainment.id, createdAt: d(2026,  4,  5) },
    // Dining — partial
    { text: 'Restaurant',             amount:   -58.00, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  4,  7) },
    { text: 'Takeaway',               amount:   -19.50, userId: user.id, budgetId: dining.id,        createdAt: d(2026,  4, 12) },
    // Utilities — partial
    { text: 'Electricity Bill',       amount:   -55.80, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  4,  6) },
    { text: 'Internet',               amount:   -29.99, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  4, 10) },
    { text: 'Phone Bill',             amount:   -25.00, userId: user.id, budgetId: utilities.id,     createdAt: d(2026,  4, 10) },
    // Misc
    { text: 'Gym Membership',         amount:   -45.00, userId: user.id, createdAt: d(2026,  4,  1) },
  ];

  for (const tx of txs) {
    await db.transaction.create({ data: tx });
  }

  console.log('✅ Done!');
  console.log('');
  console.log('   Demo account:');
  console.log('   Email:    demo@mywallet.com');
  console.log('   Password: demo1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
