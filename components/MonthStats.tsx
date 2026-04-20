import getIncomeExpense from '@/app/actions/getIncomeExpense';
import { addCommas } from '@/lib/utils';
import { getLocale } from '@/lib/i18n/getLocale';
import { getT } from '@/lib/i18n/translations';

const MonthStats = async ({ month }: { month: string }) => {
  const { income = 0, expense = 0 } = await getIncomeExpense(month);
  const t = getT(getLocale());
  const net = income - expense;
  const isPositive = net >= 0;

  return (
    <div className='month-stats'>
      <div className='stat-pill'>
        <span className='stat-label'>{t.income}</span>
        <span className='stat-value plus'>+{addCommas(income)}€</span>
      </div>
      <div className='stat-pill'>
        <span className='stat-label'>{t.expenses}</span>
        <span className='stat-value minus'>−{addCommas(expense)}€</span>
      </div>
      <div className='stat-pill'>
        <span className='stat-label'>{t.netLabel}</span>
        <span className={`stat-value ${isPositive ? 'plus' : 'minus'}`}>
          {isPositive ? '+' : '−'}{addCommas(Math.abs(net))}€
        </span>
      </div>
    </div>
  );
};

export default MonthStats;
