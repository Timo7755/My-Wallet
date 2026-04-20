import getTransactions from '@/app/actions/getTransactions';
import TransactionListClient from './TransactionListClient';
import { getLocale } from '@/lib/i18n/getLocale';
import { getT } from '@/lib/i18n/translations';

const TransactionList = async ({
  month,
  sort,
  category,
  userCategories,
}: {
  month: string;
  sort: 'asc' | 'desc';
  category?: string;
  userCategories: string[];
}) => {
  const { transactions = [], error } = await getTransactions({ month, sort, category });
  const t = getT(getLocale());

  if (error) return <p className='error'>{error}</p>;

  const categoryLabel = category ? (t.categoryLabels[category] ?? category) : '';

  return (
    <>
      <p className='history-header'>
        {t.transactions}{categoryLabel ? ` · ${categoryLabel}` : ''}
      </p>
      <TransactionListClient transactions={transactions} userCategories={userCategories} />
    </>
  );
};

export default TransactionList;
