import getIncomeExpense from '@/app/actions/getIncomeExpense';
import { addCommas } from '@/lib/utils';
import { getLocale } from '@/lib/i18n/getLocale';
import { getT } from '@/lib/i18n/translations';

const IncomeExpense = async ({ month }: { month: string }) => {
  const { income = 0, expense = 0 } = await getIncomeExpense(month);
  const t = getT(getLocale());
  const [, monthNum] = month.split('-').map(Number);
  const monthName = t.months[monthNum - 1];

  return (
    <div className='card'>
      <p className='card-title'>{monthName}</p>
      <div className='summary-row'>
        <span className='summary-row-label'>📈 {t.income}</span>
        <span className='summary-amount plus'>{addCommas(income)}€</span>
      </div>
      <div className='summary-row'>
        <span className='summary-row-label'>📉 {t.expenses}</span>
        <span className='summary-amount minus'>{addCommas(expense)}€</span>
      </div>
    </div>
  );
};

export default IncomeExpense;
