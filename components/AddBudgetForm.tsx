'use client';
import { useRef, useState } from 'react';
import addBudget from '@/app/actions/addBudget';
import { toast } from 'react-toastify';

const AddBudgetForm = ({ currentMonth }: { currentMonth: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [recurring, setRecurring] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await addBudget(formData);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Budget created');
      formRef.current?.reset();
      setRecurring(true);
    }
  };

  return (
    <div className='budget-add-card'>
      <p className='budget-add-title'>+ New Budget</p>
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
            🔁 Every month
          </button>
          <button
            type='button'
            className={`budget-toggle-btn ${!recurring ? 'active-onetime' : ''}`}
            onClick={() => setRecurring(false)}
          >
            📅 This month
          </button>
        </div>

        <input
          type='text'
          name='name'
          placeholder='e.g. Groceries, Rent...'
          required
        />
        <input
          type='number'
          name='amount'
          placeholder='Monthly limit (€)'
          step='0.01'
          min='1'
          required
        />
        <button type='submit' disabled={loading} className='btn btn-primary'>
          {loading ? 'Adding...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default AddBudgetForm;
