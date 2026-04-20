import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Providers from '@/components/Providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocaleProvider } from '@/components/LocaleProvider';
import { getLocale } from '@/lib/i18n/getLocale';

const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Wallet',
  description: 'Track your income and expenses',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocale();

  return (
    <html lang={locale}>
      <body className={roboto.className}>
        <Providers>
          <LocaleProvider locale={locale}>
            <Header />
            <main className='container'>{children}</main>
            <ToastContainer position='bottom-right' theme='colored' />
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
