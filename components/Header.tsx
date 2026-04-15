import { auth, signOut } from '@/lib/auth';
import Link from 'next/link';

const Header = async () => {
  const session = await auth();

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='brand'>
          <div className='brand-icon'>💳</div>
          My Wallet
        </div>
        <div className='nav-right'>
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
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link href='/sign-in' className='nav-signin'>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
