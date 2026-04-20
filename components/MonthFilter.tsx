'use client';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants';
import { useTranslations } from './LocaleProvider';

export default function MonthFilter({
  currentMonth,
  currentSort,
  currentCategory,
  userCategories,
}: {
  currentMonth: string;
  currentSort: string;
  currentCategory: string;
  userCategories: string[];
}) {
  const { t } = useTranslations();
  const router = useRouter();
  const [year, month] = currentMonth.split('-').map(Number);

  const go = (yyyyMM: string, sort: string, category: string = currentCategory) => {
    const params = new URLSearchParams({ month: yyyyMM, sort });
    if (category) params.set('category', category);
    router.push(`/?${params.toString()}`);
  };

  const prev = () => {
    const m = month === 1 ? 12 : month - 1;
    const y = month === 1 ? year - 1 : year;
    go(`${y}-${String(m).padStart(2, '0')}`, currentSort);
  };

  const next = () => {
    const m = month === 12 ? 1 : month + 1;
    const y = month === 12 ? year + 1 : year;
    go(`${y}-${String(m).padStart(2, '0')}`, currentSort);
  };

  const allCategories = [...CATEGORIES, ...userCategories];

  return (
    <div className='month-filter'>
      <div className='month-nav'>
        <button onClick={prev} className='nav-arrow' aria-label={t.prevMonthAria}>‹</button>
        <input
          type='month'
          value={currentMonth}
          onChange={(e) => e.target.value && go(e.target.value, currentSort)}
          className='month-picker'
          aria-label={t.selectMonthAria}
        />
        <button onClick={next} className='nav-arrow' aria-label={t.nextMonthAria}>›</button>
      </div>
      <div className='filter-right'>
        <select
          value={currentCategory}
          onChange={(e) => go(currentMonth, currentSort, e.target.value)}
          className='category-filter'
        >
          <option value=''>{t.allCategories}</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>{t.categoryLabels[c] ?? c}</option>
          ))}
        </select>
        <button onClick={() => go(currentMonth, currentSort === 'desc' ? 'asc' : 'desc')} className='sort-btn'>
          {currentSort === 'desc' ? t.newestFirst : t.oldestFirst}
        </button>
      </div>
    </div>
  );
}
