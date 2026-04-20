'use server';
import { cookies } from 'next/headers';
import type { Locale } from '@/lib/i18n/translations';

export async function setLocale(locale: Locale) {
  cookies().set('locale', locale, { maxAge: 60 * 60 * 24 * 365, path: '/' });
}
