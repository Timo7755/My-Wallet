'use client';
import { useRef, useState } from 'react';
import addTransaction from '@/app/actions/addTransaction';
import { toast } from 'react-toastify';
import { BudgetListItem } from '@/types/Budget';

const AddTransaction = ({ budgets }: { budgets: BudgetListItem[] }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const clientAction = async (formData: FormData) => {
    const rawAmount = parseFloat(formData.get('amount') as string);
    const amount = type === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

    const adjusted = new FormData();
    adjusted.set('text', formData.get('text') as string);
    adjusted.set('amount', amount.toString());

    const budgetId = formData.get('budgetId') as string;
    if (budgetId) adjusted.set('budgetId', budgetId);

    const { error } = await addTransaction(adjusted);

    if (error) {
      toast.error(error);
    } else {
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} added`);
      formRef.current?.reset();
    }
  };

  return (
    <div className='card'>
      <p className='card-title'>New Transaction</p>
      <div className='type-toggle'>
        <button
          type='button'
          className={`toggle-btn ${type === 'income' ? 'active-income' : ''}`}
          onClick={() => setType('income')}
        >
          + Income
        </button>
        <button
          type='button'
          className={`toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
          onClick={() => setType('expense')}
        >
          − Expense
        </button>
      </div>
      <form ref={formRef} action={clientAction}>
        <div className='form-control'>
          <label htmlFor='text'>Description</label>
          <input
            type='text'
            id='text'
            name='text'
            placeholder='e.g. Salary, Groceries...'
          />
        </div>
        <div className='form-control'>
          <label htmlFor='amount'>Amount (€)</label>
          <input
            type='number'
            name='amount'
            id='amount'
            placeholder='0.00'
            step='0.01'
            min='0'
          />
        </div>
        {type === 'expense' && budgets.length > 0 && (
          <div className='form-control'>
            <label htmlFor='budgetId'>Budget (optional)</label>
            <select name='budgetId' id='budgetId' className='budget-select'>
              <option value=''>— No budget —</option>
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button className={`btn btn-${type}`}>
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
