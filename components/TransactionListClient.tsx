'use client';
import { useState, useRef } from 'react';
import { Transaction } from '@/types/Transaction';
import TransactionItem from './TransactionItem';
import { useTranslations } from './LocaleProvider';

export default function TransactionListClient({
  transactions,
  userCategories,
}: {
  transactions: Transaction[];
  userCategories: string[];
}) {
  const { t } = useTranslations();
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = search.toLowerCase();

  const filtered = q
    ? transactions.filter(
        (tx) => tx.text.toLowerCase().includes(q) || tx.comment?.toLowerCase().includes(q)
      )
    : transactions;

  const suggestions = q
    ? Array.from(
        new Set(
          transactions
            .map((tx) => tx.text)
            .filter((name) => name.toLowerCase().includes(q) && name.toLowerCase() !== q)
        )
      ).slice(0, 5)
    : [];

  return (
    <div className='tx-search-wrapper'>
      <div className='tx-search-container'>
        <input
          ref={inputRef}
          type='text'
          className='tx-search-input'
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        {search && (
          <button className='tx-search-clear' onClick={() => { setSearch(''); inputRef.current?.focus(); }}>
            ×
          </button>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className='tx-suggestions'>
            {suggestions.map((s) => (
              <div
                key={s}
                className='tx-suggestion'
                onMouseDown={() => { setSearch(s); setShowSuggestions(false); }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
      {filtered.length > 0 ? (
        <div className='transaction-scroll'>
          <ul className='list'>
            {filtered.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} userCategories={userCategories} />
            ))}
          </ul>
        </div>
      ) : (
        <p className='no-transactions'>
          {search ? `${t.noResultsFor} "${search}"` : t.noTransactionsMsg}
        </p>
      )}
    </div>
  );
}
