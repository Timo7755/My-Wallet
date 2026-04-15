# My Wallet

Personal finance tracker built with Next.js, TypeScript, Prisma and NextAuth.

## Usage

### Install dependencies:

```bash
npm install
```

### Add Environment Variables:

Create a `.env` file with the following values:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: A random secret for JWT signing (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Base URL of the app (e.g. `http://localhost:3000`)

### Run database migrations:

```bash
npx prisma migrate deploy
```

### Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
