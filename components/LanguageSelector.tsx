'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLocale } from '@/app/actions/setLocale';
import { useTranslations } from './LocaleProvider';
import type { Locale } from '@/lib/i18n/translations';

export default function LanguageSelector() {
  const { locale } = useTranslations();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  };

  return (
    <div className='lang-selector'>
      <button
        onClick={() => handleChange('en')}
        className={`lang-btn ${locale === 'en' ? 'lang-active' : ''}`}
        disabled={isPending}
      >
        EN
      </button>
      <span className='lang-sep'>|</span>
      <button
        onClick={() => handleChange('sl')}
        className={`lang-btn ${locale === 'sl' ? 'lang-active' : ''}`}
        disabled={isPending}
      >
        SL
      </button>
    </div>
  );
}
