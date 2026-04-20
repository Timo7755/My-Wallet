import { BudgetWithSpending } from '@/types/Budget';
import BudgetCard from './BudgetCard';
import AddBudgetForm from './AddBudgetForm';
import { getLocale } from '@/lib/i18n/getLocale';
import { getT } from '@/lib/i18n/translations';

const BudgetSection = ({
  budgets,
  month,
}: {
  budgets: BudgetWithSpending[];
  month: string;
}) => {
  const t = getT(getLocale());
  const [year, monthNum] = month.split('-').map(Number);
  const monthName = t.months[monthNum - 1];

  return (
    <div className='budget-section'>
      <div className='budget-section-header'>
        <p className='section-label'>{t.budgetPlans}</p>
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
        <p className='no-budgets'>{t.noBudgetsMsg}</p>
      )}
    </div>
  );
};

export default BudgetSection;
