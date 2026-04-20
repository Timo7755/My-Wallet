'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Transaction } from '@/types/Transaction';
import updateTransaction from '@/app/actions/updateTransaction';
import addUserCategory from '@/app/actions/addUserCategory';
import { toast } from 'react-toastify';
import { CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants';
import CategorySelect from './CategorySelect';
import { useTranslations } from './LocaleProvider';

export default function EditModal({
  transaction,
  userCategories: initialUserCategories,
  onClose,
}: {
  transaction: Transaction;
  userCategories: string[];
  onClose: () => void;
}) {
  const { t } = useTranslations();
  const isExpense = transaction.amount < 0;
  const [type, setType] = useState<'income' | 'expense'>(isExpense ? 'expense' : 'income');
  const [incomeCategory, setIncomeCategory] = useState<'Salary' | 'Other'>(
    !isExpense && transaction.category === 'Other' ? 'Other' : 'Salary'
  );
  const [userCategories, setUserCategories] = useState(initialUserCategories);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawAmountStr = (formData.get('amount') as string).replace(',', '.');
    const rawAmount = parseFloat(rawAmountStr);
    const amount = type === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount);
    const dateStr = formData.get('date') as string;
    const comment = (formData.get('comment') as string).trim() || null;
    const category = type === 'income' ? incomeCategory : (formData.get('category') as string) || null;

    const { error } = await updateTransaction(transaction.id, {
      text: formData.get('text') as string,
      amount,
      category,
      comment,
      date: dateStr ? new Date(dateStr) : undefined,
    });

    setLoading(false);
    if (error) toast.error(error);
    else { toast.success(t.transactionUpdated); onClose(); }
  };

  const handleAddCustom = async () => {
    if (!customName.trim()) return;
    const { error } = await addUserCategory(customName);
    if (error) toast.error(error);
    else {
      setUserCategories((prev) => [...prev, customName.trim()]);
      setCustomName('');
      setShowAddCustom(false);
    }
  };

  return createPortal(
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <span className='modal-title'>{t.editTransaction}</span>
          <button className='modal-close' onClick={onClose} type='button'>×</button>
        </div>
        <div className='type-toggle'>
          <button type='button' className={`toggle-btn ${type === 'income' ? 'active-income' : ''}`} onClick={() => setType('income')}>{t.plusIncome}</button>
          <button type='button' className={`toggle-btn ${type === 'expense' ? 'active-expense' : ''}`} onClick={() => setType('expense')}>{t.minusExpense}</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label>{t.description}</label>
            <input type='text' name='text' defaultValue={transaction.text} placeholder={type === 'income' ? t.descriptionPlaceholderIncome : t.descriptionPlaceholderExpense} required />
          </div>
          <div className='form-control'>
            <label>{t.amount}</label>
            <input type='text' inputMode='decimal' name='amount' defaultValue={Math.abs(transaction.amount)} required />
          </div>
          <div className='form-control'>
            <label>{t.comment}</label>
            <input type='text' name='comment' defaultValue={transaction.comment ?? ''} placeholder={t.commentPlaceholder} />
          </div>
          <div className='form-control'>
            <label>{t.date}</label>
            <input type='date' name='date' defaultValue={new Date(transaction.date).toISOString().split('T')[0]} />
          </div>

          {type === 'income' ? (
            <div className='form-control'>
              <label>{t.category}</label>
              <div className='type-toggle' style={{ marginBottom: 0 }}>
                {INCOME_CATEGORIES.map((c) => (
                  <button key={c} type='button' className={`toggle-btn ${incomeCategory === c ? 'active-income' : ''}`} onClick={() => setIncomeCategory(c as 'Salary' | 'Other')}>
                    {t.categoryLabels[c] ?? c}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className='form-control'>
              <label>{t.categoryOptional}</label>
              <CategorySelect
                name='category'
                options={[...CATEGORIES]}
                userOptions={userCategories}
                defaultValue={transaction.category ?? ''}
              />
              {!showAddCustom ? (
                <button type='button' className='add-custom-link' onClick={() => setShowAddCustom(true)}>{t.addCustomCategory}</button>
              ) : (
                <div className='add-custom-row'>
                  <input type='text' placeholder={t.categoryName} value={customName} onChange={(e) => setCustomName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())} autoFocus />
                  <button type='button' className='btn-apply' onClick={handleAddCustom}>{t.save}</button>
                  <button type='button' className='modal-close' onClick={() => { setShowAddCustom(false); setCustomName(''); }}>×</button>
                </div>
              )}
            </div>
          )}

          <button className={`btn btn-${type}`} type='submit' disabled={loading}>
            {loading ? t.saving : t.saveChanges}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
