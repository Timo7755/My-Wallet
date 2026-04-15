import getIncomeExpense from '@/app/actions/getIncomeExpense';
import { addCommas } from '@/lib/utils';
import { MONTHS } from '@/lib/constants';

const IncomeExpense = async ({ month }: { month: string }) => {
  const { income = 0, expense = 0 } = await getIncomeExpense(month);
  const [, monthNum] = month.split('-').map(Number);
  const monthName = MONTHS[monthNum - 1];

  return (
    <div className='card'>
      <p className='card-title'>{monthName}</p>
      <div className='summary-row'>
        <span className='summary-row-label'>📈 Income</span>
        <span className='summary-amount plus'>{addCommas(income)}€</span>
      </div>
      <div className='summary-row'>
        <span className='summary-row-label'>📉 Expenses</span>
        <span className='summary-amount minus'>{addCommas(expense)}€</span>
      </div>
    </div>
  );
};

export default IncomeExpense;
