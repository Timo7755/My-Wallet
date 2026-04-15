import Link from 'next/link';

const Guest = () => {
  return (
    <div className='guest'>
      <h1>Welcome</h1>
      <p>Please sign in to manage your transactions</p>
      <Link href='/sign-in'>
        <button>Sign In</button>
      </Link>
    </div>
  );
};

export default Guest;
