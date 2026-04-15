'use client';
import { useRouter } from 'next/navigation';

export default function MonthFilter({
  currentMonth,
  currentSort,
}: {
  currentMonth: string;
  currentSort: string;
}) {
  const router = useRouter();
  const [year, month] = currentMonth.split('-').map(Number);

  const go = (yyyyMM: string, sort: string) => {
    router.push(`/?month=${yyyyMM}&sort=${sort}`);
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

  const toggleSort = () => {
    go(currentMonth, currentSort === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className='month-filter'>
      <div className='month-nav'>
        <button onClick={prev} className='nav-arrow' aria-label='Previous month'>
          ‹
        </button>
        <input
          type='month'
          value={currentMonth}
          onChange={(e) => e.target.value && go(e.target.value, currentSort)}
          className='month-picker'
          aria-label='Select month'
        />
        <button onClick={next} className='nav-arrow' aria-label='Next month'>
          ›
        </button>
      </div>
      <button onClick={toggleSort} className='sort-btn'>
        {currentSort === 'desc' ? '↓ Newest' : '↑ Oldest'}
      </button>
    </div>
  );
}
