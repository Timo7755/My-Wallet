'use client';
import { useState } from 'react';
import { Transaction } from '@/types/Transaction';
import { addCommas } from '@/lib/utils';
import { toast } from 'react-toastify';
import deleteTransaction from '@/app/actions/deleteTransaction';
import EditModal from './EditModal';
import { useTranslations } from './LocaleProvider';

const TransactionItem = ({
  transaction,
  userCategories,
}: {
  transaction: Transaction;
  userCategories: string[];
}) => {
  const { locale, t } = useTranslations();
  const [editing, setEditing] = useState(false);
  const isExpense = transaction.amount < 0;
  const sign = isExpense ? '−' : '+';

  const dateLabel = new Date(transaction.date).toLocaleDateString(
    locale === 'sl' ? 'sl-SI' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }
  );

  const handleDelete = async () => {
    const confirmed = window.confirm(t.deleteTransactionConfirm);
    if (!confirmed) return;
    const { message, error } = await deleteTransaction(transaction.id);
    if (error) toast.error(error);
    else toast.success(message);
  };

  const categoryLabel = transaction.category
    ? (t.categoryLabels[transaction.category] ?? transaction.category)
    : null;

  return (
    <li className={isExpense ? 'minus' : 'plus'}>
      <div className='transaction-left'>
        <span className='transaction-text'>{transaction.text}</span>
        {transaction.comment && (
          <span className='transaction-comment'>{transaction.comment}</span>
        )}
        <div className='transaction-meta'>
          <span className='transaction-date'>{dateLabel}</span>
          {categoryLabel && (
            <span className='category-badge'>{categoryLabel}</span>
          )}
        </div>
      </div>
      <div className='transaction-right'>
        <span className={`transaction-amount ${isExpense ? 'minus' : 'plus'}`}>
          {sign}{addCommas(Math.abs(transaction.amount))}€
        </span>
        <button onClick={() => setEditing(true)} className='edit-btn' title='Edit'>✎</button>
        <button onClick={handleDelete} className='delete-btn' title='Delete'>×</button>
      </div>
      {editing && (
        <EditModal
          transaction={transaction}
          userCategories={userCategories}
          onClose={() => setEditing(false)}
        />
      )}
    </li>
  );
};

export default TransactionItem;
