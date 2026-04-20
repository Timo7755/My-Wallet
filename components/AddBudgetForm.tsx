'use client';
import { useRef, useState } from 'react';
import addBudget from '@/app/actions/addBudget';
import { toast } from 'react-toastify';
import { useTranslations } from './LocaleProvider';

const AddBudgetForm = ({ currentMonth }: { currentMonth: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [recurring, setRecurring] = useState(true);
  const { t } = useTranslations();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await addBudget(formData);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success(t.budgetCreated);
      formRef.current?.reset();
      setRecurring(true);
    }
  };

  return (
    <div className='budget-add-card'>
      <p className='budget-add-title'>{t.newBudget}</p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input type='hidden' name='isRecurring' value={recurring.toString()} />
        {!recurring && (
          <input type='hidden' name='targetMonth' value={currentMonth} />
        )}

        <div className='budget-type-toggle'>
          <button
            type='button'
            className={`budget-toggle-btn ${recurring ? 'active-recurring' : ''}`}
            onClick={() => setRecurring(true)}
          >
            {t.everyMonth}
          </button>
          <button
            type='button'
            className={`budget-toggle-btn ${!recurring ? 'active-onetime' : ''}`}
            onClick={() => setRecurring(false)}
          >
            {t.thisMonthLabel}
          </button>
        </div>

        <input
          type='text'
          name='name'
          placeholder={t.budgetNamePlaceholder}
          required
        />
        <input
          type='number'
          name='amount'
          placeholder={t.budgetAmountPlaceholder}
          step='0.01'
          min='1'
          required
        />
        <button type='submit' disabled={loading} className='btn btn-primary'>
          {loading ? t.adding : t.create}
        </button>
      </form>
    </div>
  );
};

export default AddBudgetForm;
