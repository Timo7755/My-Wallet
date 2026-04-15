'use client';
import { useState } from 'react';
import { Transaction } from '@/types/Transaction';
import { addCommas } from '@/lib/utils';
import { toast } from 'react-toastify';
import deleteTransaction from '@/app/actions/deleteTransaction';
import EditModal from './EditModal';

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const [editing, setEditing] = useState(false);
  const isExpense = transaction.amount < 0;
  const sign = isExpense ? '−' : '+';

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this transaction?'
    );
    if (!confirmed) return;

    const { message, error } = await deleteTransaction(transaction.id);

    if (error) {
      toast.error(error);
    } else {
      toast.success(message);
    }
  };

  return (
    <li className={isExpense ? 'minus' : 'plus'}>
      <span className='transaction-text'>{transaction.text}</span>
      <div className='transaction-right'>
        <span className={`transaction-amount ${isExpense ? 'minus' : 'plus'}`}>
          {sign}{addCommas(Math.abs(transaction.amount))}€
        </span>
        <button
          onClick={() => setEditing(true)}
          className='edit-btn'
          title='Edit'
        >
          ✎
        </button>
        <button onClick={handleDelete} className='delete-btn' title='Delete'>
          ×
        </button>
      </div>
      {editing && (
        <EditModal transaction={transaction} onClose={() => setEditing(false)} />
      )}
    </li>
  );
};

export default TransactionItem;
