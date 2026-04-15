import getUserBalance from '@/app/actions/getUserBalance';
import getIncomeExpense from '@/app/actions/getIncomeExpense';
import { addCommas } from '@/lib/utils';
import { MONTHS } from '@/lib/constants';

const Balance = async ({ month }: { month: string }) => {
  const [{ balance }, { income = 0, expense = 0 }] = await Promise.all([
    getUserBalance(),
    getIncomeExpense(month),
  ]);

  const total = balance ?? 0;
  const isNegative = total < 0;
  const net = income - expense;
  const netPositive = net >= 0;

  const [year, monthNum] = month.split('-').map(Number);
  const monthName = MONTHS[monthNum - 1];

  return (
    <div className='balance-card'>
      <div className='balance-section'>
        <p className='balance-label'>Total Balance</p>
        <p className='balance-hint'>All time</p>
        <h1 className={`balance-amount${isNegative ? ' negative' : ''}`}>
          {isNegative ? '−' : ''}{addCommas(Math.abs(total))}€
        </h1>
      </div>

      <div className='balance-divider' />

      <div className='balance-section'>
        <p className='balance-label'>{monthName} {year}</p>
        <p className='balance-hint'>This month</p>
        <div className='balance-month-row'>
          <span className='balance-month-item income-text'>+{addCommas(income)}€</span>
          <span className='balance-month-sep'>/</span>
          <span className='balance-month-item expense-text'>−{addCommas(expense)}€</span>
        </div>
        <p className={`balance-net${netPositive ? '' : ' negative'}`}>
          {netPositive ? '+' : '−'}{addCommas(Math.abs(net))}€ net
        </p>
      </div>
    </div>
  );
};

export default Balance;
