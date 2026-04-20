'use client';
import { useRef, useState } from 'react';
import addTransaction from '@/app/actions/addTransaction';
import addUserCategory from '@/app/actions/addUserCategory';
import { toast } from 'react-toastify';
import { BudgetListItem } from '@/types/Budget';
import { CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants';
import CategorySelect from './CategorySelect';
import { useTranslations } from './LocaleProvider';

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const AddTransaction = ({
  budgets,
  userCategories: initialUserCategories,
}: {
  budgets: BudgetListItem[];
  userCategories: string[];
}) => {
  const { t } = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [incomeCategory, setIncomeCategory] = useState<'Salary' | 'Other'>('Salary');
  const [userCategories, setUserCategories] = useState(initialUserCategories);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [formKey, setFormKey] = useState(0);

  const clientAction = async (formData: FormData) => {
    const rawAmountStr = (formData.get('amount') as string).replace(',', '.');
    const rawAmount = parseFloat(rawAmountStr);
    const amount = type === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

    const adjusted = new FormData();
    adjusted.set('text', formData.get('text') as string);
    adjusted.set('amount', amount.toString());
    adjusted.set('date', (formData.get('date') as string) || getTodayStr());

    const comment = (formData.get('comment') as string).trim();
    if (comment) adjusted.set('comment', comment);

    if (type === 'income') {
      adjusted.set('category', incomeCategory);
    } else {
      const category = formData.get('category') as string;
      if (category) adjusted.set('category', category);
      const budgetId = formData.get('budgetId') as string;
      if (budgetId) adjusted.set('budgetId', budgetId);
    }

    const { error } = await addTransaction(adjusted);
    if (error) {
      toast.error(error);
    } else {
      toast.success(type === 'income' ? t.incomeAdded : t.expenseAdded);
      formRef.current?.reset();
      setIncomeCategory('Salary');
      setFormKey((k) => k + 1);
    }
  };

  const handleAddCustom = async () => {
    if (!customName.trim()) return;
    const { error } = await addUserCategory(customName);
    if (error) {
      toast.error(error);
    } else {
      setUserCategories((prev) => [...prev, customName.trim()]);
      setCustomName('');
      setShowAddCustom(false);
    }
  };

  return (
    <div className='card'>
      <p className='card-title'>{t.newTransaction}</p>
      <div className='type-toggle'>
        <button
          type='button'
          className={`toggle-btn ${type === 'income' ? 'active-income' : ''}`}
          onClick={() => setType('income')}
        >
          {t.plusIncome}
        </button>
        <button
          type='button'
          className={`toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
          onClick={() => setType('expense')}
        >
          {t.minusExpense}
        </button>
      </div>
      <form ref={formRef} action={clientAction}>
        <div className='form-control'>
          <label htmlFor='text'>{t.description}</label>
          <input type='text' id='text' name='text' placeholder={type === 'income' ? t.descriptionPlaceholderIncome : t.descriptionPlaceholderExpense} />
        </div>
        <div className='form-control'>
          <label htmlFor='amount'>{t.amount}</label>
          <input type='text' inputMode='decimal' name='amount' id='amount' placeholder='0.00' />
        </div>
        <div className='form-control'>
          <label htmlFor='comment'>{t.comment}</label>
          <input type='text' name='comment' id='comment' placeholder={t.commentPlaceholder} />
        </div>
        <div className='form-control'>
          <label htmlFor='date'>{t.date}</label>
          <input type='date' name='date' id='date' defaultValue={getTodayStr()} />
        </div>

        {type === 'income' ? (
          <div className='form-control'>
            <label>{t.category}</label>
            <div className='type-toggle' style={{ marginBottom: 0 }}>
              {INCOME_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type='button'
                  className={`toggle-btn ${incomeCategory === c ? 'active-income' : ''}`}
                  onClick={() => setIncomeCategory(c as 'Salary' | 'Other')}
                >
                  {t.categoryLabels[c] ?? c}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className='form-control'>
              <label>{t.categoryOptional}</label>
              <CategorySelect
                key={formKey}
                name='category'
                options={[...CATEGORIES]}
                userOptions={userCategories}
              />
              {!showAddCustom ? (
                <button type='button' className='add-custom-link' onClick={() => setShowAddCustom(true)}>
                  {t.addCustomCategory}
                </button>
              ) : (
                <div className='add-custom-row'>
                  <input
                    type='text'
                    placeholder={t.categoryName}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
                    autoFocus
                  />
                  <button type='button' className='btn-apply' onClick={handleAddCustom}>{t.save}</button>
                  <button type='button' className='modal-close' onClick={() => { setShowAddCustom(false); setCustomName(''); }}>×</button>
                </div>
              )}
            </div>
            {budgets.length > 0 && (
              <div className='form-control'>
                <label htmlFor='budgetId'>{t.budgetOptional}</label>
                <select name='budgetId' id='budgetId' className='budget-select'>
                  <option value=''>{t.noBudget}</option>
                  {budgets.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        <button className={`btn btn-${type}`}>
          {type === 'income' ? t.addIncome : t.addExpense}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
