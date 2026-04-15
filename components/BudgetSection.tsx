import { BudgetWithSpending } from '@/types/Budget';
import { MONTHS } from '@/lib/constants';
import BudgetCard from './BudgetCard';
import AddBudgetForm from './AddBudgetForm';

const BudgetSection = ({
  budgets,
  month,
}: {
  budgets: BudgetWithSpending[];
  month: string;
}) => {
  const [year, monthNum] = month.split('-').map(Number);
  const monthName = MONTHS[monthNum - 1];

  return (
    <div className='budget-section'>
      <div className='budget-section-header'>
        <p className='section-label'>Budget Plans</p>
        <p className='section-period'>
          {monthName} {year}
        </p>
      </div>
      <div className='budget-grid'>
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} currentMonth={month} />
        ))}
        <AddBudgetForm currentMonth={month} />
      </div>
      {budgets.length === 0 && (
        <p className='no-budgets'>
          No budgets for this month — create one below to start tracking your
          spending goals.
        </p>
      )}
    </div>
  );
};

export default BudgetSection;
