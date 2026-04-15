import getTransactions from '@/app/actions/getTransactions';
import TransactionItem from './TransactionItem';
import { Transaction } from '@/types/Transaction';

const TransactionList = async ({
  month,
  sort,
}: {
  month: string;
  sort: 'asc' | 'desc';
}) => {
  const { transactions, error } = await getTransactions({ month, sort });

  if (error) return <p className='error'>{error}</p>;

  return (
    <>
      <p className='history-header'>Transactions</p>
      {transactions && transactions.length > 0 ? (
        <ul className='list'>
          {transactions.map((transaction: Transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      ) : (
        <p className='no-transactions'>No transactions this month</p>
      )}
    </>
  );
};

export default TransactionList;
