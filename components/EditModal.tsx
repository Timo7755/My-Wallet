'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Transaction } from '@/types/Transaction';
import updateTransaction from '@/app/actions/updateTransaction';
import { toast } from 'react-toastify';

export default function EditModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const isExpense = transaction.amount < 0;
  const [type, setType] = useState<'income' | 'expense'>(
    isExpense ? 'expense' : 'income'
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawAmount = parseFloat(formData.get('amount') as string);
    const amount =
      type === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

    const { error } = await updateTransaction(transaction.id, {
      text: formData.get('text') as string,
      amount,
    });

    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Transaction updated');
      onClose();
    }
  };

  return createPortal(
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <span className='modal-title'>Edit Transaction</span>
          <button className='modal-close' onClick={onClose} type='button'>
            ×
          </button>
        </div>
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
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label>Description</label>
            <input
              type='text'
              name='text'
              defaultValue={transaction.text}
              required
            />
          </div>
          <div className='form-control'>
            <label>Amount (€)</label>
            <input
              type='number'
              name='amount'
              defaultValue={Math.abs(transaction.amount)}
              step='0.01'
              min='0'
              required
            />
          </div>
          <button
            className={`btn btn-${type}`}
            type='submit'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
