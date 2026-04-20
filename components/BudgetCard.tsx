'use client';
import { BudgetWithSpending } from '@/types/Budget';
import { addCommas } from '@/lib/utils';
import deleteBudget from '@/app/actions/deleteBudget';
import toggleBudgetRecurring from '@/app/actions/toggleBudgetRecurring';
import { toast } from 'react-toastify';
import { useTranslations } from './LocaleProvider';

const BAR_GREEN = 'var(--green)';
const BAR_ORANGE = '#f59e0b';
const BAR_RED = 'var(--red)';

const BudgetCard = ({
  budget,
  currentMonth,
}: {
  budget: BudgetWithSpending;
  currentMonth: string;
}) => {
  const { t } = useTranslations();
  const pct = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
  const clampedPct = Math.min(pct, 100);
  const remaining = Math.max(budget.amount - budget.spent, 0);
  const isOver = budget.spent > budget.amount;
  const barColor = pct < 70 ? BAR_GREEN : pct < 90 ? BAR_ORANGE : BAR_RED;

  const badgeMonth = budget.targetMonth
    ? (() => {
        const [y, m] = budget.targetMonth.split('-').map(Number);
        return `${t.months[m - 1]} ${y}`;
      })()
    : null;

  const handleDelete = async () => {
    if (!confirm(`${t.deleteBudgetConfirmPrefix}${budget.name}${t.deleteBudgetConfirmSuffix}`)) return;
    const { error } = await deleteBudget(budget.id);
    if (error) toast.error(error);
    else toast.success(t.budgetDeleted);
  };

  const handleToggleRecurring = async () => {
    const makeRecurring = !budget.isRecurring;
    const { error } = await toggleBudgetRecurring(budget.id, makeRecurring, currentMonth);
    if (error) {
      toast.error(error);
    } else {
      toast.success(makeRecurring ? t.budgetSetRecurring : t.budgetSetOneTime);
    }
  };

  return (
    <div className='budget-card'>
      <div className='budget-card-header'>
        <span className='budget-name'>{budget.name}</span>
        <button onClick={handleDelete} className='budget-delete' title={t.deleteBudgetTitle}>
          ×
        </button>
      </div>

      <button
        onClick={handleToggleRecurring}
        className={`budget-type-badge ${budget.isRecurring ? 'badge-recurring' : 'badge-onetime'}`}
        title={t.toggleRecurringTitle}
      >
        {budget.isRecurring ? t.everyMonth : `📅 ${badgeMonth}`}
      </button>

      <p className='budget-limit'>{addCommas(budget.amount)}{t.perMonth}</p>

      <div className='budget-bar'>
        <div
          className='budget-progress'
          style={{ width: `${clampedPct}%`, background: barColor }}
        />
      </div>

      <div className='budget-stats'>
        <span className='muted-text'>{addCommas(budget.spent)}€ {t.spentLabel}</span>
        <span className={isOver ? 'over-text' : 'left-text'}>
          {isOver
            ? `${addCommas(budget.spent - budget.amount)}€ ${t.overLabel}`
            : `${addCommas(remaining)}€ ${t.leftLabel}`}
        </span>
      </div>
      <p className='budget-pct'>{pct.toFixed(0)}{t.usedLabel}</p>
    </div>
  );
};

export default BudgetCard;
