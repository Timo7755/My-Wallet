import getIncomeExpense from '@/app/actions/getIncomeExpense';
import { addCommas } from '@/lib/utils';

const MonthStats = async ({ month }: { month: string }) => {
  const { income = 0, expense = 0 } = await getIncomeExpense(month);
  const net = income - expense;
  const isPositive = net >= 0;

  return (
    <div className='month-stats'>
      <div className='stat-pill'>
        <span className='stat-label'>Income</span>
        <span className='stat-value plus'>+{addCommas(income)}€</span>
      </div>
      <div className='stat-pill'>
        <span className='stat-label'>Expenses</span>
        <span className='stat-value minus'>−{addCommas(expense)}€</span>
      </div>
      <div className='stat-pill'>
        <span className='stat-label'>Net</span>
        <span className={`stat-value ${isPositive ? 'plus' : 'minus'}`}>
          {isPositive ? '+' : '−'}{addCommas(Math.abs(net))}€
        </span>
      </div>
    </div>
  );
};

export default MonthStats;
