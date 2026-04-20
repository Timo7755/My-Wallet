import { cookies } from 'next/headers';
import type { Locale } from './translations';

export function getLocale(): Locale {
  const locale = cookies().get('locale')?.value;
  return locale === 'sl' ? 'sl' : 'en';
}
