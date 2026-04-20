import { auth } from '@/lib/auth';
import AddTransaction from '@/components/AddTransaction';
import Balance from '@/components/Balance';
import IncomeExpense from '@/components/IncomeExpense';
import TransactionList from '@/components/TransactionList';
import MonthFilter from '@/components/MonthFilter';
import MonthStats from '@/components/MonthStats';
import BudgetSection from '@/components/BudgetSection';
import RecurringSection from '@/components/RecurringSection';
import getBudgets from '@/app/actions/getBudgets';
import getRecurringExpenses from '@/app/actions/getRecurringExpenses';
import getUserCategories from '@/app/actions/getUserCategories';
import { checkAndApplyRecurring } from '@/lib/checkAndApplyRecurring';
import { getLocale } from '@/lib/i18n/getLocale';
import { getT } from '@/lib/i18n/translations';

type SearchParams = { [key: string]: string | string[] | undefined };

const HomePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const session = await auth();

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const month = typeof searchParams.month === 'string' ? searchParams.month : defaultMonth;
  const sort = searchParams.sort === 'asc' ? 'asc' : 'desc';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';

  if (session?.user?.id) await checkAndApplyRecurring(session.user.id);

  const [{ budgets = [] }, { recurring = [] }, { categories: userCategories = [] }] =
    await Promise.all([getBudgets(month), getRecurringExpenses(), getUserCategories()]);

  const budgetList = budgets.map((b) => ({ id: b.id, name: b.name }));
  const t = getT(getLocale());

  return (
    <>
      <p className='welcome-text'>{t.hello}, {session?.user?.name?.split(' ')[0]} 👋</p>
      <Balance month={month} />
      <div className='app-layout'>
        <div className='left-panel'>
          <IncomeExpense month={month} />
          <AddTransaction budgets={budgetList} userCategories={userCategories} />
        </div>
        <div className='right-panel'>
          <MonthFilter
            currentMonth={month}
            currentSort={sort}
            currentCategory={category}
            userCategories={userCategories}
          />
          <MonthStats month={month} />
          <TransactionList
            month={month}
            sort={sort}
            category={category}
            userCategories={userCategories}
          />
        </div>
      </div>
      <BudgetSection budgets={budgets} month={month} />
      <RecurringSection recurring={recurring} month={month} />
    </>
  );
};

export default HomePage;
