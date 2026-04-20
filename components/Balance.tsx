import getUserBalance from '@/app/actions/getUserBalance';
import getIncomeExpense from '@/app/actions/getIncomeExpense';
import { addCommas } from '@/lib/utils';
import { getLocale } from '@/lib/i18n/getLocale';
import { getT } from '@/lib/i18n/translations';

const Balance = async ({ month }: { month: string }) => {
  const [{ balance }, { income = 0, expense = 0 }] = await Promise.all([
    getUserBalance(),
    getIncomeExpense(month),
  ]);

  const t = getT(getLocale());
  const total = balance ?? 0;
  const isNegative = total < 0;
  const net = income - expense;
  const netPositive = net >= 0;

  const [year, monthNum] = month.split('-').map(Number);
  const monthName = t.months[monthNum - 1];

  return (
    <div className='balance-card'>
      <div className='balance-section'>
        <p className='balance-label'>{t.totalBalance}</p>
        <p className='balance-hint'>{t.allTime}</p>
        <h1 className={`balance-amount${isNegative ? ' negative' : ''}`}>
          {isNegative ? '−' : ''}{addCommas(Math.abs(total))}€
        </h1>
      </div>

      <div className='balance-divider' />

      <div className='balance-section'>
        <p className='balance-label'>{monthName} {year}</p>
        <p className='balance-hint'>{t.thisMonth}</p>
        <div className='balance-month-row'>
          <span className='balance-month-item income-text'>+{addCommas(income)}€</span>
          <span className='balance-month-sep'>/</span>
          <span className='balance-month-item expense-text'>−{addCommas(expense)}€</span>
        </div>
        <p className={`balance-net${netPositive ? '' : ' negative'}`}>
          {netPositive ? '+' : '−'}{addCommas(Math.abs(net))}€ {t.net}
        </p>
      </div>
    </div>
  );
};

export default Balance;
