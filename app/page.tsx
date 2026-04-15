import { auth } from '@/lib/auth';
import AddTransaction from '@/components/AddTransaction';
import Balance from '@/components/Balance';
import IncomeExpense from '@/components/IncomeExpense';
import TransactionList from '@/components/TransactionList';
import MonthFilter from '@/components/MonthFilter';
import MonthStats from '@/components/MonthStats';
import BudgetSection from '@/components/BudgetSection';
import getBudgets from '@/app/actions/getBudgets';

type SearchParams = { [key: string]: string | string[] | undefined };

const HomePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const session = await auth();

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const month = typeof searchParams.month === 'string' ? searchParams.month : defaultMonth;
  const sort = searchParams.sort === 'asc' ? 'asc' : 'desc';

  const { budgets = [] } = await getBudgets(month);
  const budgetList = budgets.map((b) => ({ id: b.id, name: b.name }));

  return (
    <>
      <p className='welcome-text'>Hello, {session?.user?.name?.split(' ')[0]} 👋</p>
      <Balance month={month} />
      <div className='app-layout'>
        <div className='left-panel'>
          <IncomeExpense month={month} />
          <AddTransaction budgets={budgetList} />
        </div>
        <div className='right-panel'>
          <MonthFilter currentMonth={month} currentSort={sort} />
          <MonthStats month={month} />
          <TransactionList month={month} sort={sort} />
        </div>
      </div>
      <BudgetSection budgets={budgets} month={month} />
    </>
  );
};

export default HomePage;
