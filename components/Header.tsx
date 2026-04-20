import { auth, signOut } from '@/lib/auth';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { getLocale } from '@/lib/i18n/getLocale';
import { getT } from '@/lib/i18n/translations';

const Header = async () => {
  const session = await auth();
  const t = getT(getLocale());

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='brand'>
          <div className='brand-icon'>💳</div>
          My Wallet
        </div>
        <div className='nav-right'>
          <LanguageSelector />
          {session?.user ? (
            <>
              <span className='nav-user'>{session.user.name}</span>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/sign-in' });
                }}
              >
                <button type='submit' className='btn-signout'>
                  {t.signOut}
                </button>
              </form>
            </>
          ) : (
            <Link href='/sign-in' className='nav-signin'>
              {t.signIn}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
