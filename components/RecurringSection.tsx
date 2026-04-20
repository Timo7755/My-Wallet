'use client';
import { useRef, useState } from 'react';
import { RecurringExpense } from '@/types/RecurringExpense';
import { CATEGORIES } from '@/lib/constants';
import { addCommas } from '@/lib/utils';
import addRecurringExpense from '@/app/actions/addRecurringExpense';
import deleteRecurringExpense from '@/app/actions/deleteRecurringExpense';
import applyRecurringExpense from '@/app/actions/applyRecurringExpense';
import applyAllRecurring from '@/app/actions/applyAllRecurring';
import updateRecurringExpense from '@/app/actions/updateRecurringExpense';
import { toast } from 'react-toastify';
import { useTranslations } from './LocaleProvider';
import type { Locale } from '@/lib/i18n/translations';

const ordinal = (n: number, locale: Locale) => {
  if (locale === 'sl') return `${n}.`;
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const RecurringSection = ({ recurring, month }: { recurring: RecurringExpense[]; month: string }) => {
  const { locale, t } = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [autoApplyNew, setAutoApplyNew] = useState(true);
  const [year, monthNum] = month.split('-').map(Number);
  const monthName = t.months[monthNum - 1];

  const handleApply = async (id: string, name: string) => {
    setLoadingId(id);
    const { error } = await applyRecurringExpense(id);
    setLoadingId(null);
    if (error) toast.error(error);
    else toast.success(`"${name}" ${t.addedToTransactions}`);
  };

  const handleApplyAll = async () => {
    setLoadingId('all');
    const { count, error } = await applyAllRecurring();
    setLoadingId(null);
    if (error) toast.error(error);
    else {
      const word = count === 1 ? t.expenseWord : t.expensesWord;
      toast.success(`${count} ${word} ${t.addedTo} ${monthName}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${t.removeRecurringConfirmPrefix}${name}${t.removeRecurringConfirmSuffix}`)) return;
    const { error } = await deleteRecurringExpense(id);
    if (error) toast.error(error);
    else toast.success(t.removed);
  };

  const handleToggleAutoApply = async (id: string, current: boolean) => {
    const { error } = await updateRecurringExpense(id, { autoApply: !current });
    if (error) toast.error(error);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('autoApply', autoApplyNew.toString());
    const { error } = await addRecurringExpense(formData);
    if (error) toast.error(error);
    else {
      toast.success(t.recurringAdded);
      formRef.current?.reset();
      setAutoApplyNew(true);
    }
  };

  return (
    <div className='recurring-section'>
      <div className='budget-section-header'>
        <p className='section-label'>{t.recurringExpenses}</p>
        <p className='section-period'>{monthName} {year}</p>
      </div>

      {recurring.length > 0 && (
        <div className='recurring-list'>
          {recurring.map((r) => (
            <div key={r.id} className='recurring-item'>
              <div className='recurring-info'>
                <span className='recurring-name'>{r.name}</span>
                {r.category && <span className='category-badge'>{t.categoryLabels[r.category] ?? r.category}</span>}
                <span className='recurring-day-badge'>{ordinal(r.dayOfMonth, locale)} {t.ofMonth}</span>
              </div>
              <div className='recurring-right'>
                <label className='auto-apply-toggle' title='Auto-apply on scheduled day'>
                  <input
                    type='checkbox'
                    checked={r.autoApply}
                    onChange={() => handleToggleAutoApply(r.id, r.autoApply)}
                  />
                  <span>{t.autoLabel}</span>
                </label>
                <span className='recurring-amount'>−{addCommas(r.amount)}€</span>
                <button
                  className='btn-apply'
                  onClick={() => handleApply(r.id, r.name)}
                  disabled={loadingId === r.id}
                >
                  {loadingId === r.id ? '...' : '+ Add'}
                </button>
                <button
                  className='delete-btn recurring-delete'
                  onClick={() => handleDelete(r.id, r.name)}
                  title={t.removed}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button
            className='btn btn-expense apply-all-btn'
            onClick={handleApplyAll}
            disabled={loadingId === 'all'}
          >
            {loadingId === 'all' ? t.applying : `${t.applyAllTo} ${monthName}`}
          </button>
        </div>
      )}

      <div className='recurring-add-card'>
        <p className='budget-add-title'>{t.newRecurring}</p>
        <form ref={formRef} onSubmit={handleAdd}>
          <input type='text' name='name' placeholder={t.recurringNamePlaceholder} required />
          <input type='text' inputMode='decimal' name='amount' placeholder={t.amount} required />
          <select name='category' className='budget-select'>
            <option value=''>{t.categoryOptionalPlaceholder}</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{t.categoryLabels[c] ?? c}</option>)}
          </select>
          <div className='recurring-day-row'>
            <label>{t.dayOfMonth}</label>
            <input type='number' name='dayOfMonth' min='1' max='31' defaultValue='1' className='day-input' required />
          </div>
          <label className='auto-apply-label'>
            <input type='checkbox' checked={autoApplyNew} onChange={(e) => setAutoApplyNew(e.target.checked)} />
            {t.autoApplyLabel}
          </label>
          <button type='submit' className='btn btn-expense'>{t.addRecurringBtn}</button>
        </form>
      </div>
    </div>
  );
};

export default RecurringSection;
