'use client';
import { createContext, useContext } from 'react';
import { getT } from '@/lib/i18n/translations';
import type { Locale, Translations } from '@/lib/i18n/translations';

interface LocaleCtx {
  locale: Locale;
  t: Translations;
}

const LocaleContext = createContext<LocaleCtx>({ locale: 'en', t: getT('en') });

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, t: getT(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslations() {
  return useContext(LocaleContext);
}
