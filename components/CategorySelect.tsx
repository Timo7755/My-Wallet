'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from './LocaleProvider';

interface Props {
  name: string;
  options: string[];
  userOptions?: string[];
  defaultValue?: string;
  placeholder?: string;
}

export default function CategorySelect({
  name,
  options,
  userOptions = [],
  defaultValue = '',
  placeholder,
}: Props) {
  const { t } = useTranslations();
  const resolvedPlaceholder = placeholder ?? t.categoryOptionalPlaceholder;

  const [value, setValue] = useState(defaultValue);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const label = (o: string) => t.categoryLabels[o] ?? o;

  const allOptions = [...options, ...userOptions];
  const filtered = allOptions.filter((o) =>
    label(o).toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (v: string) => {
    setValue(v);
    setOpen(false);
    setSearch('');
  };

  const toggle = () => {
    setOpen((o) => !o);
    if (!open) setTimeout(() => searchRef.current?.focus(), 30);
  };

  return (
    <div className='cat-select' ref={ref}>
      <input type='hidden' name={name} value={value} />
      <button
        type='button'
        className={`cat-trigger ${!value ? 'cat-placeholder' : ''}`}
        onClick={toggle}
      >
        <span>{value ? label(value) : resolvedPlaceholder}</span>
        <span className='cat-arrow'>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className='cat-dropdown'>
          <input
            ref={searchRef}
            type='text'
            className='cat-search'
            placeholder={t.catSearchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className='cat-options'>
            <div className='cat-option cat-none' onMouseDown={() => select('')}>{resolvedPlaceholder}</div>
            {filtered.map((o) => (
              <div
                key={o}
                className={`cat-option ${value === o ? 'cat-selected' : ''}`}
                onMouseDown={() => select(o)}
              >
                {label(o)}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className='cat-option cat-empty'>{t.catNoMatches}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
